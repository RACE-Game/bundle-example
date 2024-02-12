import { field, array } from '@race-foundation/borsh'

export class Player {
  @field('u64')
  id!: bigint;

  @field('u64')
  chips!: bigint;

  @field('usize')
  position!: number;

  @field('u8')
  status!: number;

  @field('u8')
  timeout!: number;

  constructor(fields: any) {
    Object.assign(this, fields)
  }
}

export class ActingPlayer {
  @field('u64')
  id!: string;

  @field('usize')
  position!: number;

  @field('u64')
  clock!: bigint;

  constructor(fields: any) {
    Object.assign(this, fields);
  }
}

export class Pot {
  @field(array('u64'))
  owners!: bigint[];

  @field(array('u64'))
  winners!: bigint[];

  @field('u64')
  amount!: bigint;

  constructor(fields: any) {
    Object.assign(this, fields)
  }
}
