import { variant, array, option, map, field, struct } from '@race-foundation/borsh'
import { Pot } from './base';
import { PlayerStatus, PLAYER_STATUSES } from './enums'

export class AwardPot {
  @field(array('u64'))
  winners!: bigint[];

  @field('u64')
  amount!: bigint;

  constructor(fields: any) {
    Object.assign(this, fields)
  }
}

export class PlayerResult {
  @field('u64')
  id!: bigint;

  @field('u64')
  chips!: bigint;

  @field(option('u64'))
  prize!: bigint | undefined;

  @field('u8')
  statusRaw: number
  status: PlayerStatus

  @field('usize')
  position!: number

  constructor(fields: any) {
    Object.assign(this, fields)
    this.status = PLAYER_STATUSES[this.statusRaw]
  }
}

export abstract class Display {}

@variant(0)
export class DealCards extends Display {

  displayType = 'DealCards'

  constructor(_: any = {}) {
    super();
  }
}

@variant(1)
export class DealBoard extends Display {
  @field('usize')
  prev!: number;

  @field(array('string'))
  board!: string[];

  displayType = 'DealBoard'

  constructor(fields: any) {
    super();
    Object.assign(this, fields);
  }
}

@variant(2)
export class CollectBets extends Display {
  @field(array(struct(Pot)))
  old_pots!: Pot[]

  @field(map('u64', 'u64'))
  bet_map!: Map<bigint, bigint>;

  displayType = 'CollectBets'

  constructor(fields: any) {
    super();
    Object.assign(this, fields);
  }
}

@variant(3)
export class AwardPots extends Display {
  @field(array(struct(AwardPot)))
  pots!: AwardPot[];

  displayType = 'AwardPots'

  constructor(fields: any) {
    super();
    Object.assign(this, fields);
  }
}

@variant(4)
export class GameResult extends Display {
  @field(map('u64', struct(PlayerResult)))
  player_map!: Map<bigint, PlayerResult>

  displayType = 'GameResult'

  constructor(fields: any) {
    super();
    Object.assign(this, fields);
  }
}
