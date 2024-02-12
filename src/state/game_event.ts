import { field, variant } from "@race-foundation/borsh";

export abstract class GameEvent {}

@variant(0)
class Bet extends GameEvent {
  @field('u64')
  amount!: bigint;

  constructor(fields: any) {
    super();
    Object.assign(this, fields)
  }
}

@variant(1)
class Check extends GameEvent {
  constructor(_fields: any) {
    super();
  }
}

@variant(2)
class Call extends GameEvent {
  constructor(_fields: any) {
    super();
  }
}

@variant(3)
class Fold extends GameEvent {
  constructor(_fields: any) {
    super();
  }
}

@variant(0)
class Raise extends GameEvent {
  @field('u64')
  amount!: bigint;

  constructor(fields: any) {
    super();
    Object.assign(this, fields)
  }
}
