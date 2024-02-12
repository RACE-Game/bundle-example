import { variant, array, option, map, field, struct } from '@race-foundation/borsh'

export class AwardPot {
  @field(array('u64'))
  winners!: bigint[];

  @field('u64')
  amount!: bigint;
}

export class ChipsChange {
  @field('u64')
  id!: bigint;

  @field('u64')
  before!: bigint;

  @field('u64')
  after!: bigint;
}

export abstract class Display {}

@variant(0)
export class DealCards extends Display {
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

  constructor(fields: any) {
    super();
    Object.assign(this, fields);
  }
}

@variant(2)
export class CollectBets extends Display {
  @field(map('u64', 'u64'))
  bet_map!: Map<bigint, bigint>;

  constructor(fields: any) {
    super();
    Object.assign(this, fields);
  }
}

@variant(3)
export class ChangeChips extends Display {
  @field(array(struct(ChipsChange)))
  changes!: ChipsChange[];

  constructor(fields: any) {
    super();
    Object.assign(this, fields);
  }
}

@variant(4)
export class AwardPots extends Display {
  @field(array(struct(AwardPot)))
  pots!: AwardPot[];

  constructor(fields: any) {
    super();
    Object.assign(this, fields);
  }
}
