import { BLIND_TYPES, BlindType } from './enums';
import { GameEvent } from './game_event'
import { array, struct, map, variant, enums, field } from '@race-foundation/borsh'


export class BlindBet {
  @field('u64')
  id!: bigint;

  @field('u8')
  blind_typeRaw!: number;
  blind_type: BlindType

  @field('u64')
  amount: bigint;

  constructor(fields: any) {
    Object.assign(this, fields)
    this.blind_type = BLIND_TYPES[this.blind_typeRaw]
  }
}

class PlayerAction {
  @field('u64')
  id!: bigint;

  @field(enums(GameEvent))
  event!: GameEvent;

  constructor(fields: any) {
    Object.assign(this, fields)
  }
}

class Showdown {
  @field(array('string'))
  hole_cards: string[];

  @field('u8')
  category!: number;

  @field(array('string'))
  picks!: string[]

  constructor(fields: any) {
    Object.assign(this, fields)
  }
}

class StreetActions {
  @field('u64')
  pot!: bigint;

  @field(array(struct(PlayerAction)))
  actions!: PlayerAction[];

  constructor(fields: any) {
    Object.assign(this, fields)
  }
}

abstract class ChipsChange {}

@variant(0)
export class ChipsChangeNoUpdate extends ChipsChange {
  constructor(_fields: any) {
    super()
  }
}

@variant(1)
export class ChipsChangeAdd extends ChipsChange {
  @field('u64')
  change: bigint;
  constructor(fields: any) {
    super()
    Object.assign(this, fields)
  }
}

@variant(2)
export class ChipsChangeSub extends ChipsChange {
  @field('u64')
  change: bigint;
  constructor(fields: any) {
    super()
    Object.assign(this, fields)
  }
}

export class HandHistory {
  @field(array('string'))
  board!: string[];

  @field(array(struct(BlindBet)))
  blinds!: BlindBet[];

  @field(struct(StreetActions))
  preflop!: StreetActions;

  @field(struct(StreetActions))
  flop!: StreetActions;

  @field(struct(StreetActions))
  turn!: StreetActions;

  @field(struct(StreetActions))
  river!: StreetActions;

  @field(map('u64', struct(Showdown)))
  showdowns!: Map<bigint, Showdown>;

  @field(map('u64', enums(ChipsChange)))
  chips_change!: Map<bigint, ChipsChange>;

  constructor(fields: any) {
    Object.assign(this, fields)
  }
}
