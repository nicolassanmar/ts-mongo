import { Document, ObjectId } from 'mongodb'

/** Using regular `Omit` in discriminated unions breaks them (TS will no longer discriminate between them). This utility type
 * removes the desired keys, while maintaining the discriminated union. */
export type OmitUnion<Type, Field extends string | number | symbol> = {
  [Property in keyof Type as Exclude<Property, Field>]: Type[Property]
}

export declare type DocumentWithId = Document & { _id: ObjectId }

export declare type OptionalId<TSchema extends DocumentWithId> = OmitUnion<
  TSchema,
  '_id'
> &
  Partial<Pick<TSchema, '_id'>>

export declare type BaseTypes =
  | null
  | string
  | number
  | boolean
  | Date
  | RegExp
  | Buffer
  | Uint8Array
  | ObjectId
  | { _bsontype: string }

export declare type Doc = { [x in string]: _Doc }
export declare type _Doc = BaseTypes | _Doc[] | { [x in string]: _Doc }

export declare type RecurPartial<T> = T extends BaseTypes
  ? T
  : T extends ReadonlyArray<infer ArrayType>
  ? ReadonlyArray<RecurPartial<ArrayType>>
  : T extends Record<string, unknown>
  ? { readonly [P in keyof T]?: RecurPartial<T[P]> }
  : never

/**
 * Array extends Document so need a document that does not match an Array
 * However, must also extend Document for `TSchema[Property]` to be valid
 */
export declare type NonArrayObject = {
  readonly [x: string]: unknown
  readonly [y: number]: never
}

export declare type RemodelType<NewType, OldType> = NewType &
  OmitUnion<OldType, keyof NewType>

export declare type NonNeverKeys<TSchema extends NonArrayObject> = {
  [Key in keyof TSchema]: TSchema[Key] extends never ? never : Key
}[keyof TSchema]

export declare type RecurRemoveNever<TSchema> = TSchema extends BaseTypes
  ? TSchema
  : TSchema extends NonArrayObject
  ? { [Key in NonNeverKeys<TSchema>]: RecurRemoveNever<TSchema[Key]> }
  : TSchema extends ReadonlyArray<infer ArrayType>
  ? Array<RecurRemoveNever<ArrayType>>
  : never

/**
 * Allow only one of the keys in `Keys` to be present in `T`
 */
export type AllowOnlyOne<T, Keys extends keyof T = keyof T> = OmitUnion<
  T,
  Keys
> &
  {
    [K in keyof T]: Pick<T, K> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys]

/**
 * Extract what is common in all elements of a union. In discriminated type unions, it will only keep the discriminator,
 * and it will be narrowly typed. Should not be used in base types or arrays.
 * For example: { type: 'a'; foo: number } | { type: 'b'; bar: string } => { type: 'a' | 'b }
 */
export type FlattenUnion<T> = Pick<T, keyof T>

/**
 * Apply the FlattenUnion type recursively, extracting  what is common in all elements of all unions.
 */
export declare type RecurFlattenUnion<
  T,
  F = FlattenUnion<T>
> = T extends BaseTypes
  ? T
  : T extends Array<infer ArrayType>
  ? Array<RecurFlattenUnion<ArrayType>>
  : T extends ReadonlyArray<infer ArrayType>
  ? ReadonlyArray<RecurFlattenUnion<ArrayType>>
  : T extends Record<string, unknown>
  ? { readonly [P in keyof F]: RecurFlattenUnion<F[P]> }
  : never

export declare interface TimeOptions {
  /** Used to control whether to update `updatedAt` on update operations. Only works on time collections. Default is `true` */
  setUpdatedAt?: boolean
}
