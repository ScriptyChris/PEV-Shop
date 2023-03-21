pev-shop

# pev-shop

## Table of contents

### Modules

- [logger](#modulesloggermd)
- [types](#modulestypesmd)

[pev-shop](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / RecentWelcomeVisitTimestamp

# Class: RecentWelcomeVisitTimestamp

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).RecentWelcomeVisitTimestamp

## Hierarchy

- [`StorageService`](#classestypes_internal_storageservicemd)

  ↳ **`RecentWelcomeVisitTimestamp`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new RecentWelcomeVisitTimestamp**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Overrides

[StorageService](#classestypes_internal_storageservicemd).[constructor](#constructor)

#### Defined in

[src/frontend/features/storageService.ts:95](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L95)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:21](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L21)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:47](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L47)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:59](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L59)

___

### update

▸ **update**(`timestamp`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `timestamp` | `number` |

#### Returns

`void`

#### Overrides

[StorageService](#classestypes_internal_storageservicemd).[update](#update)

#### Defined in

[src/frontend/features/storageService.ts:99](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L99)

[pev-shop](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / StorageService

# Class: StorageService

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).StorageService

## Hierarchy

- **`StorageService`**

  ↳ [`UserCart`](#classestypes_internal_usercartmd)

  ↳ [`UserAccount`](#classestypes_internal_useraccountmd)

  ↳ [`UserAuthToken`](#classestypes_internal_userauthtokenmd)

  ↳ [`RecentWelcomeVisitTimestamp`](#classestypes_internal_recentwelcomevisittimestampmd)

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new StorageService**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Defined in

[src/frontend/features/storageService.ts:23](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L23)

## Properties

### key

• **key**: `string`

#### Defined in

[src/frontend/features/storageService.ts:21](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L21)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Defined in

[src/frontend/features/storageService.ts:47](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L47)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Defined in

[src/frontend/features/storageService.ts:59](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L59)

___

### update

▸ **update**(`value`, `checkIfShouldRemove`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`TStorageValue`](#tstoragevalue) |
| `checkIfShouldRemove` | () => `boolean` |

#### Returns

`void`

#### Defined in

[src/frontend/features/storageService.ts:31](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L31)

[pev-shop](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / StoreService

# Class: StoreService

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).StoreService

## Table of contents

### Constructors

- [constructor](#constructor)

### Accessors

- [appSetup](#appsetup)
- [productComparisonState](#productcomparisonstate)
- [userAccountState](#useraccountstate)
- [userCartProducts](#usercartproducts)
- [userCartProductsCount](#usercartproductscount)
- [userCartState](#usercartstate)
- [userCartTotalPrice](#usercarttotalprice)

### Methods

- [addProductToUserCartState](#addproducttousercartstate)
- [clearAllUserData](#clearalluserdata)
- [clearProductComparisonState](#clearproductcomparisonstate)
- [clearProductObservedState](#clearproductobservedstate)
- [clearUserAccountState](#clearuseraccountstate)
- [clearUserCartState](#clearusercartstate)
- [removeProductFromUserCartState](#removeproductfromusercartstate)
- [replaceUserCartState](#replaceusercartstate)
- [updateAppSetup](#updateappsetup)
- [updateProductComparisonState](#updateproductcomparisonstate)
- [updateProductObservedState](#updateproductobservedstate)
- [updateUserAccountState](#updateuseraccountstate)

## Constructors

### constructor

• **new StoreService**()

#### Defined in

[src/frontend/features/storeService.ts:29](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L29)

## Accessors

### appSetup

• `get` **appSetup**(): [`TAppSetup`](#tappsetup) \| `Record`<`never`, `never`\>

#### Returns

[`TAppSetup`](#tappsetup) \| `Record`<`never`, `never`\>

#### Defined in

[src/frontend/features/storeService.ts:150](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L150)

___

### productComparisonState

• `get` **productComparisonState**(): { `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Returns

{ `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Defined in

[src/frontend/features/storeService.ts:174](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L174)

___

### userAccountState

• `get` **userAccountState**(): ``null`` \| [`TUserPublic`](#tuserpublic)

#### Returns

``null`` \| [`TUserPublic`](#tuserpublic)

#### Defined in

[src/frontend/features/storeService.ts:170](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L170)

___

### userCartProducts

• `get` **userCartProducts**(): { `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Returns

{ `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Defined in

[src/frontend/features/storeService.ts:158](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L158)

___

### userCartProductsCount

• `get` **userCartProductsCount**(): `number`

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:166](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L166)

___

### userCartState

• `get` **userCartState**(): [`IUserCart`](#interfacestypesiusercartmd)

#### Returns

[`IUserCart`](#interfacestypesiusercartmd)

#### Defined in

[src/frontend/features/storeService.ts:154](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L154)

___

### userCartTotalPrice

• `get` **userCartTotalPrice**(): `number`

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:162](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L162)

## Methods

### addProductToUserCartState

▸ **addProductToUserCartState**(`newUserCartState`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | `Object` |
| `newUserCartState._id` | `string` |
| `newUserCartState.availability` | `number` |
| `newUserCartState.name` | `string` |
| `newUserCartState.price` | `number` |
| `newUserCartState.quantity` | `number` |

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:63](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L63)

___

### clearAllUserData

▸ **clearAllUserData**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:146](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L146)

___

### clearProductComparisonState

▸ **clearProductComparisonState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:134](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L134)

___

### clearProductObservedState

▸ **clearProductObservedState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:142](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L142)

___

### clearUserAccountState

▸ **clearUserAccountState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:58](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L58)

___

### clearUserCartState

▸ **clearUserCartState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:104](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L104)

___

### removeProductFromUserCartState

▸ **removeProductFromUserCartState**(`newUserCartState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | `Object` |
| `newUserCartState._id` | `string` |
| `newUserCartState.availability` | `number` |
| `newUserCartState.name` | `string` |
| `newUserCartState.price` | `number` |
| `newUserCartState.quantity` | `number` |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:84](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L84)

___

### replaceUserCartState

▸ **replaceUserCartState**(`newUserCartState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | [`IUserCart`](#interfacestypesiusercartmd) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:111](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L111)

___

### updateAppSetup

▸ **updateAppSetup**(`newAppSetup`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newAppSetup` | [`TAppSetup`](#tappsetup) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:50](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L50)

___

### updateProductComparisonState

▸ **updateProductComparisonState**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.add` | `Object` |
| `__namedParameters.add._id` | `string` |
| `__namedParameters.add.availability` | `number` |
| `__namedParameters.add.name` | `string` |
| `__namedParameters.add.price` | `number` |
| `__namedParameters.add.quantity` | `number` |
| `__namedParameters.remove` | `Partial`<{ `_id`: `string` ; `index`: `number`  }\> |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:117](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L117)

___

### updateProductObservedState

▸ **updateProductObservedState**(`observedProductsIDs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `observedProductsIDs` | `undefined` \| `ObjectId`[] |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:138](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L138)

___

### updateUserAccountState

▸ **updateUserAccountState**(`userAccountState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `userAccountState` | [`TUserPublic`](#tuserpublic) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:54](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L54)

[pev-shop](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / UserAccount

# Class: UserAccount

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).UserAccount

## Hierarchy

- [`StorageService`](#classestypes_internal_storageservicemd)

  ↳ **`UserAccount`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new UserAccount**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Overrides

[StorageService](#classestypes_internal_storageservicemd).[constructor](#constructor)

#### Defined in

[src/frontend/features/storageService.ts:75](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L75)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:21](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L21)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:47](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L47)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:59](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L59)

___

### update

▸ **update**(`accountState`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountState` | [`TUserPublic`](#tuserpublic) |

#### Returns

`void`

#### Overrides

[StorageService](#classestypes_internal_storageservicemd).[update](#update)

#### Defined in

[src/frontend/features/storageService.ts:79](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L79)

[pev-shop](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / UserAuthToken

# Class: UserAuthToken

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).UserAuthToken

## Hierarchy

- [`StorageService`](#classestypes_internal_storageservicemd)

  ↳ **`UserAuthToken`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new UserAuthToken**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Overrides

[StorageService](#classestypes_internal_storageservicemd).[constructor](#constructor)

#### Defined in

[src/frontend/features/storageService.ts:85](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L85)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:21](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L21)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:47](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L47)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:59](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L59)

___

### update

▸ **update**(`authToken`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `authToken` | `string` |

#### Returns

`void`

#### Overrides

[StorageService](#classestypes_internal_storageservicemd).[update](#update)

#### Defined in

[src/frontend/features/storageService.ts:89](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L89)

[pev-shop](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / UserCart

# Class: UserCart

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).UserCart

## Hierarchy

- [`StorageService`](#classestypes_internal_storageservicemd)

  ↳ **`UserCart`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new UserCart**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Overrides

[StorageService](#classestypes_internal_storageservicemd).[constructor](#constructor)

#### Defined in

[src/frontend/features/storageService.ts:65](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L65)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:21](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L21)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:47](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L47)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:59](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L59)

___

### update

▸ **update**(`cartState`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartState` | [`IUserCart`](#interfacestypesiusercartmd) |

#### Returns

`void`

#### Overrides

[StorageService](#classestypes_internal_storageservicemd).[update](#update)

#### Defined in

[src/frontend/features/storageService.ts:69](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L69)

[pev-shop](#readmemd) / [types](#modulestypesmd) / HTTP\_STATUS\_CODE

# Enumeration: HTTP\_STATUS\_CODE

[types](#modulestypesmd).HTTP_STATUS_CODE

## Table of contents

### Enumeration Members

- [BAD\_REQUEST](#bad_request)
- [CONFLICT](#conflict)
- [CREATED](#created)
- [FORBIDDEN](#forbidden)
- [INTERNAL\_SERVER\_ERROR](#internal_server_error)
- [NETWORK\_AUTH\_REQUIRED](#network_auth_required)
- [NOT\_FOUND](#not_found)
- [NOT\_MODIFIED](#not_modified)
- [NO\_CONTENT](#no_content)
- [OK](#ok)
- [SERVICE\_UNAVAILABLE](#service_unavailable)
- [UNAUTHORIZED](#unauthorized)

## Enumeration Members

### BAD\_REQUEST

• **BAD\_REQUEST**

#### Defined in

[commons/types.ts:50](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L50)

___

### CONFLICT

• **CONFLICT**

#### Defined in

[commons/types.ts:54](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L54)

___

### CREATED

• **CREATED**

#### Defined in

[commons/types.ts:46](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L46)

___

### FORBIDDEN

• **FORBIDDEN**

#### Defined in

[commons/types.ts:52](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L52)

___

### INTERNAL\_SERVER\_ERROR

• **INTERNAL\_SERVER\_ERROR**

#### Defined in

[commons/types.ts:55](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L55)

___

### NETWORK\_AUTH\_REQUIRED

• **NETWORK\_AUTH\_REQUIRED**

#### Defined in

[commons/types.ts:57](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L57)

___

### NOT\_FOUND

• **NOT\_FOUND**

#### Defined in

[commons/types.ts:53](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L53)

___

### NOT\_MODIFIED

• **NOT\_MODIFIED**

#### Defined in

[commons/types.ts:49](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L49)

___

### NO\_CONTENT

• **NO\_CONTENT**

#### Defined in

[commons/types.ts:47](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L47)

___

### OK

• **OK**

#### Defined in

[commons/types.ts:45](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L45)

___

### SERVICE\_UNAVAILABLE

• **SERVICE\_UNAVAILABLE**

#### Defined in

[commons/types.ts:56](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L56)

___

### UNAUTHORIZED

• **UNAUTHORIZED**

#### Defined in

[commons/types.ts:51](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L51)

[pev-shop](#readmemd) / [types](#modulestypesmd) / IOrderPayload

# Interface: IOrderPayload

[types](#modulestypesmd).IOrderPayload

## Table of contents

### Properties

- [payment](#payment)
- [products](#products)
- [receiver](#receiver)
- [shipment](#shipment)

## Properties

### payment

• **payment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `method` | ``"cash"`` \| ``"card"`` \| ``"transfer"`` \| ``"blik"`` |

#### Defined in

[commons/types.ts:78](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L78)

___

### products

• **products**: `Pick`<[`IProductInOrder`](#interfacestypesiproductinordermd), ``"id"`` \| ``"quantity"``\>[]

#### Defined in

[commons/types.ts:85](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L85)

___

### receiver

• **receiver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `name` | `string` |
| `phone` | `string` |

#### Defined in

[commons/types.ts:73](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L73)

___

### shipment

• **shipment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `method` | ``"inPerson"`` \| ``"home"`` \| ``"parcelLocker"`` |

#### Defined in

[commons/types.ts:81](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L81)

[pev-shop](#readmemd) / [types](#modulestypesmd) / IPayByLinkMethod

# Interface: IPayByLinkMethod

[types](#modulestypesmd).IPayByLinkMethod

## Table of contents

### Properties

- [maxAmount](#maxamount)
- [minAmount](#minamount)
- [name](#name)
- [status](#status)
- [type](#type)
- [value](#value)

## Properties

### maxAmount

• **maxAmount**: `number`

#### Defined in

[commons/types.ts:39](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L39)

___

### minAmount

• **minAmount**: `number`

#### Defined in

[commons/types.ts:38](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L38)

___

### name

• **name**: `string`

#### Defined in

[commons/types.ts:36](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L36)

___

### status

• **status**: ``"ENABLED"`` \| ``"DISABLED"`` \| ``"TEMPORARY_DISABLED"``

#### Defined in

[commons/types.ts:37](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L37)

___

### type

• `Optional` **type**: ``"PBL"`` \| ``"PAYMENT_WALL"``

#### Defined in

[commons/types.ts:34](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L34)

___

### value

• **value**: `string`

#### Defined in

[commons/types.ts:35](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L35)

[pev-shop](#readmemd) / [types](#modulestypesmd) / IProductInOrder

# Interface: IProductInOrder

[types](#modulestypesmd).IProductInOrder

## Table of contents

### Properties

- [id](#id)
- [quantity](#quantity)
- [unitPrice](#unitprice)

## Properties

### id

• **id**: `ObjectId`

#### Defined in

[commons/types.ts:28](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L28)

___

### quantity

• **quantity**: `number`

#### Defined in

[commons/types.ts:30](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L30)

___

### unitPrice

• **unitPrice**: `number`

#### Defined in

[commons/types.ts:29](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L29)

[pev-shop](#readmemd) / [types](#modulestypesmd) / IUserCart

# Interface: IUserCart

[types](#modulestypesmd).IUserCart

## Table of contents

### Properties

- [products](#products)
- [totalCount](#totalcount)
- [totalPrice](#totalprice)

## Properties

### products

• **products**: { `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Defined in

[commons/types.ts:61](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L61)

___

### totalCount

• **totalCount**: `number`

#### Defined in

[commons/types.ts:68](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L68)

___

### totalPrice

• **totalPrice**: `number`

#### Defined in

[commons/types.ts:69](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L69)

[pev-shop](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / ICustomResExt

# Interface: ICustomResExt

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).ICustomResExt

## Table of contents

### Properties

- [\_\_ERROR\_TO\_HANDLE](#__error_to_handle)
- [\_\_EXCEPTION\_ALREADY\_HANDLED](#__exception_already_handled)
- [\_\_NO\_CONTENT](#__no_content)

## Properties

### \_\_ERROR\_TO\_HANDLE

• **\_\_ERROR\_TO\_HANDLE**: `Pick`<[`IEmbracedResponse`](#interfacestypes_internal_iembracedresponsemd)<`never`\>, ``"error"``\>

#### Defined in

[src/frontend/features/httpService.ts:619](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/httpService.ts#L619)

___

### \_\_EXCEPTION\_ALREADY\_HANDLED

• **\_\_EXCEPTION\_ALREADY\_HANDLED**: ``true``

#### Defined in

[src/frontend/features/httpService.ts:620](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/httpService.ts#L620)

___

### \_\_NO\_CONTENT

• **\_\_NO\_CONTENT**: ``true``

#### Defined in

[src/frontend/features/httpService.ts:618](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/httpService.ts#L618)

[pev-shop](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / IEmbracedResponse

# Interface: IEmbracedResponse<PayloadType\>

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).IEmbracedResponse

## Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `never` |

## Table of contents

### Properties

- [authToken](#authtoken)
- [error](#error)
- [exception](#exception)
- [message](#message)
- [payload](#payload)

## Properties

### authToken

• **authToken**: ``null`` \| `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:11](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/middleware/helpers/middleware-response-wrapper.ts#L11)

___

### error

• **error**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:14](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/middleware/helpers/middleware-response-wrapper.ts#L14)

___

### exception

• **exception**: `Error` \| { `message`: `string` ; `stack?`: `string`  }

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:15](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/middleware/helpers/middleware-response-wrapper.ts#L15)

___

### message

• **message**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:13](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/middleware/helpers/middleware-response-wrapper.ts#L13)

___

### payload

• **payload**: `unknown`[] \| `PayloadType` \| `Record`<`string`, `unknown`\>

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:12](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/middleware/helpers/middleware-response-wrapper.ts#L12)

[pev-shop](#readmemd) / [logger](#modulesloggermd) / <internal\>

# Namespace: <internal\>

[logger](#modulesloggermd).<internal>

[pev-shop](#readmemd) / logger

# Module: logger

Custom wrapper for a commonly used global `console` methods.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#moduleslogger_internal_md)

### Type Aliases

- [TLogger](#tlogger)

### Functions

- [getLogger](#getlogger)

## Type Aliases

### TLogger

Ƭ **TLogger**: `Logger`

#### Defined in

[commons/logger.ts:72](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/logger.ts#L72)

## Functions

### getLogger

▸ **getLogger**(`moduleFileName`): `Logger`

Creates a module bound logger, which name will be visually emphased in output logs.

**`example`** Log output for `middleware-index` module
([Module: middleware-index.js])::  Server is listening on port 3000

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleFileName` | `string` |

#### Returns

`Logger`

#### Defined in

[commons/logger.ts:62](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/logger.ts#L62)

[pev-shop](#readmemd) / [types](#modulestypesmd) / <internal\>

# Namespace: <internal\>

[types](#modulestypesmd).<internal>

## Table of contents

### Classes

- [RecentWelcomeVisitTimestamp](#classestypes_internal_recentwelcomevisittimestampmd)
- [StorageService](#classestypes_internal_storageservicemd)
- [StoreService](#classestypes_internal_storeservicemd)
- [UserAccount](#classestypes_internal_useraccountmd)
- [UserAuthToken](#classestypes_internal_userauthtokenmd)
- [UserCart](#classestypes_internal_usercartmd)

### Interfaces

- [ICustomResExt](#interfacestypes_internal_icustomresextmd)
- [IEmbracedResponse](#interfacestypes_internal_iembracedresponsemd)

### Type Aliases

- [TStorageValue](#tstoragevalue)
- [TUserPublic](#tuserpublic)

### Variables

- [storageService](#storageservice)
- [storeService](#storeservice)
- [userSessionService](#usersessionservice)

## Type Aliases

### TStorageValue

Ƭ **TStorageValue**: [`IUserCart`](#interfacestypesiusercartmd) \| [`TUserPublic`](#tuserpublic) \| `NonNullable`<`IUser`[``"tokens"``][``"auth"``]\>[`number`] \| ``null`` \| `ReturnType`<typeof `Date.now`\>

#### Defined in

[src/frontend/features/storageService.ts:9](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L9)

___

### TUserPublic

Ƭ **TUserPublic**: `Pick`<`IUser`, ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"``\> & { `_id`: `Types.ObjectId` ; `accountType`: `NonNullable`<`IUser`[``"accountType"``]\>[``"roleName"``]  }

#### Defined in

[src/database/models/_user.ts:306](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/database/models/_user.ts#L306)

## Variables

### storageService

• `Const` **storageService**: `Object`

Manipulating storage data API for various contexts, such as `UserCart` or `UserAccount`.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `recentWelcomeVisitTimestamp` | [`RecentWelcomeVisitTimestamp`](#classestypes_internal_recentwelcomevisittimestampmd) |
| `userAccount` | [`UserAccount`](#classestypes_internal_useraccountmd) |
| `userAuthToken` | [`UserAuthToken`](#classestypes_internal_userauthtokenmd) |
| `userCart` | [`UserCart`](#classestypes_internal_usercartmd) |
| `clearAllUserData` | () => `void` |

#### Defined in

[src/frontend/features/storageService.ts:19](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storageService.ts#L19)

___

### storeService

• `Const` **storeService**: [`StoreService`](#classestypes_internal_storeservicemd)

#### Defined in

[src/frontend/features/storeService.ts:206](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/storeService.ts#L206)

___

### userSessionService

• `Const` **userSessionService**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `logIn` | (`logInCredentials`: `Pick`<`IUser`, ``"login"`` \| ``"password"``\>) => `Promise`<[`TUserPublic`](#tuserpublic) \| `Pick`<[`ICustomResExt`](#interfacestypes_internal_icustomresextmd), ``"__EXCEPTION_ALREADY_HANDLED"``\>\> |
| `logOut` | () => `Promise`<`Pick`<[`ICustomResExt`](#interfacestypes_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacestypes_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacestypes_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\> |
| `logOutFromMultipleSessions` | (`shouldPreserveCurrentSession`: `boolean`) => `Promise`<`Pick`<[`ICustomResExt`](#interfacestypes_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacestypes_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacestypes_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\> |
| `restoreSession` | () => `void` |

#### Defined in

[src/frontend/features/userSessionService.ts:12](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/src/frontend/features/userSessionService.ts#L12)

[pev-shop](#readmemd) / types

# Module: types

Common types for whole app.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulestypes_internal_md)

### Enumerations

- [HTTP\_STATUS\_CODE](#enumstypeshttp_status_codemd)

### Interfaces

- [IOrderPayload](#interfacestypesiorderpayloadmd)
- [IPayByLinkMethod](#interfacestypesipaybylinkmethodmd)
- [IProductInOrder](#interfacestypesiproductinordermd)
- [IUserCart](#interfacestypesiusercartmd)

### Type Aliases

- [TAppSetup](#tappsetup)
- [TPagination](#tpagination)

## Type Aliases

### TAppSetup

Ƭ **TAppSetup**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `emailServiceUrl` | `string` |
| `previousAppResetTimestamp` | `number` |
| `remainingTimestampToNextAppReset` | `number` |

#### Defined in

[commons/types.ts:113](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L113)

___

### TPagination

Ƭ **TPagination**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pageNumber` | `number` |
| `productsPerPage` | `number` |

#### Defined in

[commons/types.ts:88](https://github.com/ScriptyChris/PEV-Shop/blob/b29728d/commons/types.ts#L88)
