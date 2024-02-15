import { SolanaTransport, SolanaWalletAdapter } from '@race-foundation/sdk-solana'
import { AppClient, GameContextSnapshot, GameEvent, IWallet, PlayerProfileWithPfp } from '@race-foundation/sdk-core'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { Holdem } from './state'
import { Bet, Call, Check, Fold, Raise } from './state/game_event'
import { FacadeTransport, FacadeWallet } from '@race-foundation/sdk-facade'

let wallet: IWallet | undefined
let client: AppClient | undefined

function buildTransport() {
  return new SolanaTransport('https://rpc.racepoker.app')
  // return new FacadeTransport('http://localhost:12002')
}

function toJson(obj: any) {
  return JSON.stringify(obj, (_, val) => {
    if (typeof val === 'bigint') {
      return val.toString()
    } else if (val instanceof Map) {
      let obj: any = {}
      for (const [k, v] of val.entries()) {
        obj[k.toString()] = v
      }
      return obj
    } else {
      return val
    }
  })
}

export async function connectWallet() {
  const phantom = new PhantomWalletAdapter()
  await phantom.connect()
  wallet = new SolanaWalletAdapter(phantom)
  console.log('Wallet connect')
  return wallet
}

export async function fetchGames(regAddr: string) {
  console.log(`Fetch games from registration: ${regAddr}`)
  const transport = buildTransport()
  const registration = await transport.getRegistration(regAddr)
  if (registration === undefined) throw new Error('Registration not found')
  const games = toJson(registration.games)
  console.log(`there are ${registration.games.length} games`)
  return games
}

type OnEvent = (state: string, event: string, decryption: string) => void
type OnProfile = (id: string, profile: string) => void
type OnGameInfo = (info: string) => void

export async function exitGame() {
  client.exit()
}

export async function detachGame() {
  client.detach()
}

export async function joinGame(amount: bigint) {
  await client.join({ amount, createProfileIfNeeded: true })
}

export async function attachGame(gameAddr: string,
  callbacks: {
    onEvent: OnEvent,
    onProfile: OnProfile,
    onInfo: OnGameInfo
  }) {
  if (wallet === undefined) throw new Error('Wallet is not connected')
  const transport = buildTransport()

  const onProfile = (id: bigint | undefined, profile: PlayerProfileWithPfp) => {
    const _id = id + ''
    const _profile = toJson(profile)
    callbacks.onProfile(_id, _profile)
  }

  const onEvent = async (_ctx: GameContextSnapshot, rawState: Uint8Array, event: GameEvent | undefined) => {
    const state = Holdem.deserialize(rawState)
    const stateJson = toJson(state);
    let decryptionJson = "{}"
    if (state.deck_random_id > 0) {
      const decryption = await client.getRevealed(state.deck_random_id)
      decryptionJson = toJson(decryption)
    }
    let patchedEvent = null
    if (event) {
      patchedEvent = { eventType: event.kind(), ...event }
    }
    const eventJson = toJson(patchedEvent)
    callbacks.onEvent(stateJson, eventJson, decryptionJson)
  }

  client = await AppClient.initialize({
    wallet,
    transport,
    gameAddr,
    onProfile,
    onEvent,
    onMessage: undefined,
    onTxState: undefined,
    onConnectionState: undefined,
    storage: window.localStorage,
  });

  callbacks.onInfo(toJson(client.info))

  await client.attachGame()
  return client
}

export async function check() {
  await client.submitEvent(new Check({}))
}

export async function bet(amount: bigint) {
  await client.submitEvent(new Bet({ amount }))
}

export async function raise(amount: bigint) {
  await client.submitEvent(new Raise({ amount }))
}

export async function call() {
  await client.submitEvent(new Call({}))
}

export async function fold() {
  await client.submitEvent(new Fold({}))
}
