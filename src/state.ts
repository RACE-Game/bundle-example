import { field, array, option, map, deserialize, enums, struct } from '@race-foundation/borsh'
import { HOLDEM_STAGES, HoldemStage, STREETS, Street, GAME_MODES, GameMode } from './state/enums'
import { HandHistory } from './state/hand_history'
import { Display } from './state/display'
import { ActingPlayer, Player, Pot } from './state/base'

export class Holdem {
  @field('usize')
  deck_random_id!: number

  @field('u64')
  sb!: bigint

  @field('u64')
  bb!: bigint

  @field('u64')
  min_raise!: bigint

  @field('usize')
  btn!: number

  @field('u16')
  rake!: number

  @field('u8')
  rakeCap!: number

  @field('u8')
  stageRaw!: number
  stage: HoldemStage

  @field('u8')
  streetRaw!: number
  street: Street

  @field('u64')
  street_bet!: bigint

  @field(array('string'))
  board!: string[]

  @field(map('u64', array('usize')))
  hand_index_map!: Map<bigint, number[]>

  @field(map('u64', 'u64'))
  bet_map!: Map<bigint, bigint>

  @field(map('u64', 'u64'))
  total_bet_map!: Map<bigint, bigint>

  @field(map('u64', 'u64'))
  prize_map!: Map<bigint, bigint>

  @field(map('u64', struct(Player)))
  player_map!: Map<bigint, Player>

  @field(array('u64'))
  player_order!: bigint[]

  @field(array(struct(Pot)))
  pots!: Pot[]

  @field(option(struct(ActingPlayer)))
  acting_player!: ActingPlayer | undefined

  @field(array('u64'))
  winners!: bigint[]

  @field(array(enums(Display)))
  display!: Display[]

  @field('u8')
  modeRaw!: number
  mode: GameMode

  @field('u64')
  next_game_start!: bigint

  @field('u8')
  table_size!: number

  @field(struct(HandHistory))
  hand_history!: HandHistory

  constructor(fields: any) {
    Object.assign(this, fields)
    this.stage = HOLDEM_STAGES[this.stageRaw]
    this.street = STREETS[this.streetRaw]
    this.mode = GAME_MODES[this.modeRaw]
  }

  static deserialize(data: Uint8Array): Holdem {
    return deserialize(Holdem, data)
  }
}
