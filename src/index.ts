import { SolanaTransport, SolanaWalletAdapter } from '@race-foundation/sdk-solana'
import { AppClient, GameContextSnapshot, GameEvent, IWallet, PlayerProfileWithPfp } from '@race-foundation/sdk-core'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { Holdem } from './state'
import { Bet, Call, Check, Fold, Raise } from './state/game_event'

let wallet: IWallet | undefined
let client: AppClient | undefined

function buildTransport() {
  return new SolanaTransport('https://rpc.racepoker.app')
}

function toJson(obj: any) {
  return JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v)
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

type OnEvent = (state: string, event: string) => void
type OnProfile = (id: string, profile: string) => void

export async function exitGame() {
  client.exit()
}

export async function detachGame() {
  client.detach()
}

export async function attachGame(gameAddr: string,
  callbacks: {
    onEvent: OnEvent,
    onProfile: OnProfile
  }) {
  if (wallet === undefined) throw new Error('Wallet is not connected')
  const transport = buildTransport()

  const onProfile = (id: bigint | undefined, profile: PlayerProfileWithPfp) => {
    const _id = id + ''
    const _profile = toJson(profile)
    callbacks.onProfile(_id, _profile)
  }

  const onEvent = (_ctx: GameContextSnapshot, rawState: Uint8Array, event: GameEvent | undefined) => {
    const state = Holdem.deserialize(rawState)
    const stateJson = toJson(state);
    let patchedEvent = null
    if (event) {
      patchedEvent = { eventType: event.kind(), ...event }
    }
    const eventJson = toJson(patchedEvent)
    callbacks.onEvent(stateJson, eventJson)
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
  })

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
