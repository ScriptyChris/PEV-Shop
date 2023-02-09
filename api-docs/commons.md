fake-pev-shopping

# fake-pev-shopping

## Table of contents

### Modules

- [logger](#modulesloggermd)
- [types](#modulestypesmd)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / StorageService

# Class: StorageService

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).StorageService

## Hierarchy

- **`StorageService`**

  ↳ [`UserCart`](#classestypes_internal_usercartmd)

  ↳ [`UserAccount`](#classestypes_internal_useraccountmd)

  ↳ [`UserAuthToken`](#classestypes_internal_userauthtokenmd)

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

[src/frontend/features/storageService.ts:18](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L18)

## Properties

### key

• **key**: `string`

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L54)

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

[src/frontend/features/storageService.ts:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L26)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / StoreService

# Class: StoreService

[types](#modulestypesmd).[<internal>](#modulestypes_internal_md).StoreService

## Table of contents

### Constructors

- [constructor](#constructor)

### Accessors

- [productComparisonState](#productcomparisonstate)
- [userAccountState](#useraccountstate)
- [userCartProducts](#usercartproducts)
- [userCartProductsCount](#usercartproductscount)
- [userCartState](#usercartstate)
- [userCartTotalPrice](#usercarttotalprice)

### Methods

- [addProductToUserCartState](#addproducttousercartstate)
- [clearProductComparisonState](#clearproductcomparisonstate)
- [clearProductObservedState](#clearproductobservedstate)
- [clearUserAccountState](#clearuseraccountstate)
- [clearUserCartState](#clearusercartstate)
- [removeProductFromUserCartState](#removeproductfromusercartstate)
- [replaceUserCartState](#replaceusercartstate)
- [updateProductComparisonState](#updateproductcomparisonstate)
- [updateProductObservedState](#updateproductobservedstate)
- [updateUserAccountState](#updateuseraccountstate)

## Constructors

### constructor

• **new StoreService**()

#### Defined in

[src/frontend/features/storeService.ts:27](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L27)

## Accessors

### productComparisonState

• `get` **productComparisonState**(): [`TUserCartProduct`](#tusercartproduct)[]

#### Returns

[`TUserCartProduct`](#tusercartproduct)[]

#### Defined in

[src/frontend/features/storeService.ts:143](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L143)

___

### userAccountState

• `get` **userAccountState**(): ``null`` \| [`TUserPublic`](#tuserpublic)

#### Returns

``null`` \| [`TUserPublic`](#tuserpublic)

#### Defined in

[src/frontend/features/storeService.ts:139](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L139)

___

### userCartProducts

• `get` **userCartProducts**(): { `_id`: `string` ; `name`: `string` ; `price`: `number`  }[]

#### Returns

{ `_id`: `string` ; `name`: `string` ; `price`: `number`  }[]

#### Defined in

[src/frontend/features/storeService.ts:127](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L127)

___

### userCartProductsCount

• `get` **userCartProductsCount**(): `number`

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:135](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L135)

___

### userCartState

• `get` **userCartState**(): [`IUserCart`](#interfacestypesiusercartmd)

#### Returns

[`IUserCart`](#interfacestypesiusercartmd)

#### Defined in

[src/frontend/features/storeService.ts:123](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L123)

___

### userCartTotalPrice

• `get` **userCartTotalPrice**(): `number`

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:131](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L131)

## Methods

### addProductToUserCartState

▸ **addProductToUserCartState**(`newUserCartState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | [`TUserCartProduct`](#tusercartproduct) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:47](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L47)

___

### clearProductComparisonState

▸ **clearProductComparisonState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:111](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L111)

___

### clearProductObservedState

▸ **clearProductObservedState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:119](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L119)

___

### clearUserAccountState

▸ **clearUserAccountState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:43](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L43)

___

### clearUserCartState

▸ **clearUserCartState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:81](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L81)

___

### removeProductFromUserCartState

▸ **removeProductFromUserCartState**(`newUserCartState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | [`TUserCartProduct`](#tusercartproduct) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:61](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L61)

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

[src/frontend/features/storeService.ts:88](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L88)

___

### updateProductComparisonState

▸ **updateProductComparisonState**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.add` | [`TUserCartProduct`](#tusercartproduct) |
| `__namedParameters.remove` | `Partial`<{ `_id`: `string` ; `index`: `number`  }\> |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:94](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L94)

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

[src/frontend/features/storeService.ts:115](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L115)

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

[src/frontend/features/storeService.ts:39](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L39)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / UserAccount

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

[src/frontend/features/storageService.ts:70](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L70)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L54)

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

[src/frontend/features/storageService.ts:74](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L74)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / UserAuthToken

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

[src/frontend/features/storageService.ts:80](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L80)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L54)

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

[src/frontend/features/storageService.ts:84](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L84)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / UserCart

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

[src/frontend/features/storageService.ts:60](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L60)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classestypes_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L54)

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

[src/frontend/features/storageService.ts:64](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L64)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / HTTP\_STATUS\_CODE

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

[commons/types.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L42)

___

### CONFLICT

• **CONFLICT**

#### Defined in

[commons/types.ts:46](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L46)

___

### CREATED

• **CREATED**

#### Defined in

[commons/types.ts:38](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L38)

___

### FORBIDDEN

• **FORBIDDEN**

#### Defined in

[commons/types.ts:44](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L44)

___

### INTERNAL\_SERVER\_ERROR

• **INTERNAL\_SERVER\_ERROR**

#### Defined in

[commons/types.ts:47](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L47)

___

### NETWORK\_AUTH\_REQUIRED

• **NETWORK\_AUTH\_REQUIRED**

#### Defined in

[commons/types.ts:49](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L49)

___

### NOT\_FOUND

• **NOT\_FOUND**

#### Defined in

[commons/types.ts:45](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L45)

___

### NOT\_MODIFIED

• **NOT\_MODIFIED**

#### Defined in

[commons/types.ts:41](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L41)

___

### NO\_CONTENT

• **NO\_CONTENT**

#### Defined in

[commons/types.ts:39](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L39)

___

### OK

• **OK**

#### Defined in

[commons/types.ts:37](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L37)

___

### SERVICE\_UNAVAILABLE

• **SERVICE\_UNAVAILABLE**

#### Defined in

[commons/types.ts:48](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L48)

___

### UNAUTHORIZED

• **UNAUTHORIZED**

#### Defined in

[commons/types.ts:43](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L43)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / IOrder

# Interface: IOrder

[types](#modulestypesmd).IOrder

## Table of contents

### Properties

- [paymentType](#paymenttype)
- [price](#price)
- [products](#products)
- [receiver](#receiver)
- [shipmentType](#shipmenttype)

## Properties

### paymentType

• **paymentType**: ``"Cash"`` \| ``"Card"`` \| ``"Transfer"`` \| ``"BLIK"``

#### Defined in

[commons/types.ts:73](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L73)

___

### price

• **price**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `shipment` | `number` |
| `total` | `number` |

#### Defined in

[commons/types.ts:75](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L75)

___

### products

• **products**: { `_id`: `string` ; `name`: `string` ; `price`: `number`  }[] & { `count`: `number`  }[]

#### Defined in

[commons/types.ts:74](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L74)

___

### receiver

• **receiver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `baseInfo` | { `email`: `string` ; `name`: `string` ; `phone`: `string`  } |
| `baseInfo.email` | `string` |
| `baseInfo.name` | `string` |
| `baseInfo.phone` | `string` |

#### Defined in

[commons/types.ts:63](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L63)

___

### shipmentType

• **shipmentType**: ``"inPerson"`` \| ``"home"`` \| ``"parcelLocker"``

#### Defined in

[commons/types.ts:71](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L71)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / IPayByLinkMethod

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

[commons/types.ts:31](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L31)

___

### minAmount

• **minAmount**: `number`

#### Defined in

[commons/types.ts:30](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L30)

___

### name

• **name**: `string`

#### Defined in

[commons/types.ts:28](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L28)

___

### status

• **status**: ``"ENABLED"`` \| ``"DISABLED"`` \| ``"TEMPORARY_DISABLED"``

#### Defined in

[commons/types.ts:29](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L29)

___

### type

• `Optional` **type**: ``"PBL"`` \| ``"PAYMENT_WALL"``

#### Defined in

[commons/types.ts:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L26)

___

### value

• **value**: `string`

#### Defined in

[commons/types.ts:27](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L27)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / IProductInOrder

# Interface: IProductInOrder

[types](#modulestypesmd).IProductInOrder

## Table of contents

### Properties

- [name](#name)
- [quantity](#quantity)
- [unitPrice](#unitprice)

## Properties

### name

• **name**: `string`

#### Defined in

[commons/types.ts:20](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L20)

___

### quantity

• **quantity**: `number`

#### Defined in

[commons/types.ts:22](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L22)

___

### unitPrice

• **unitPrice**: `number`

#### Defined in

[commons/types.ts:21](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L21)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / IUserCart

# Interface: IUserCart

[types](#modulestypesmd).IUserCart

## Table of contents

### Properties

- [products](#products)
- [totalCount](#totalcount)
- [totalPrice](#totalprice)

## Properties

### products

• **products**: { `_id`: `string` ; `name`: `string` ; `price`: `number`  }[]

#### Defined in

[commons/types.ts:53](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L53)

___

### totalCount

• **totalCount**: `number`

#### Defined in

[commons/types.ts:58](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L58)

___

### totalPrice

• **totalPrice**: `number`

#### Defined in

[commons/types.ts:59](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L59)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / ICustomResExt

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

[src/frontend/features/httpService.ts:586](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/httpService.ts#L586)

___

### \_\_EXCEPTION\_ALREADY\_HANDLED

• **\_\_EXCEPTION\_ALREADY\_HANDLED**: ``true``

#### Defined in

[src/frontend/features/httpService.ts:587](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/httpService.ts#L587)

___

### \_\_NO\_CONTENT

• **\_\_NO\_CONTENT**: ``true``

#### Defined in

[src/frontend/features/httpService.ts:585](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/httpService.ts#L585)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / [<internal\>](#modulestypes_internal_md) / IEmbracedResponse

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

[src/middleware/helpers/middleware-response-wrapper.ts:11](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L11)

___

### error

• **error**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L14)

___

### exception

• **exception**: `Error` \| { `message`: `string` ; `stack?`: `string`  }

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:15](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L15)

___

### message

• **message**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:13](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L13)

___

### payload

• **payload**: `unknown`[] \| `PayloadType` \| `Record`<`string`, `unknown`\>

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L12)

[fake-pev-shopping](#readmemd) / [logger](#modulesloggermd) / <internal\>

# Namespace: <internal\>

[logger](#modulesloggermd).<internal>

[fake-pev-shopping](#readmemd) / logger

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

[commons/logger.ts:72](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/logger.ts#L72)

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

[commons/logger.ts:62](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/logger.ts#L62)

[fake-pev-shopping](#readmemd) / [types](#modulestypesmd) / <internal\>

# Namespace: <internal\>

[types](#modulestypesmd).<internal>

## Table of contents

### Classes

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
- [TUserCartProduct](#tusercartproduct)
- [TUserPublic](#tuserpublic)

### Variables

- [storageService](#storageservice)
- [storeService](#storeservice)
- [userSessionService](#usersessionservice)

## Type Aliases

### TStorageValue

Ƭ **TStorageValue**: [`IUserCart`](#interfacestypesiusercartmd) \| [`TUserPublic`](#tuserpublic) \| `NonNullable`<`IUser`[``"tokens"``][``"auth"``]\>[`number`] \| ``null``

#### Defined in

[src/frontend/features/storageService.ts:9](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L9)

___

### TUserCartProduct

Ƭ **TUserCartProduct**: [`IUserCart`](#interfacestypesiusercartmd)[``"products"``][`number`] & { `count`: `number`  }

#### Defined in

[src/frontend/features/storeService.ts:17](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L17)

___

### TUserPublic

Ƭ **TUserPublic**: `Pick`<`IUser`, ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"``\> & { `_id`: `Schema.Types.ObjectId` ; `accountType`: `NonNullable`<`IUser`[``"accountType"``]\>[``"roleName"``]  }

#### Defined in

[src/database/models/_user.ts:242](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_user.ts#L242)

## Variables

### storageService

• `Const` **storageService**: `Object`

Manipulating storage data API for various contexts, such as `UserCart` or `UserAccount`.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `userAccount` | [`UserAccount`](#classestypes_internal_useraccountmd) |
| `userAuthToken` | [`UserAuthToken`](#classestypes_internal_userauthtokenmd) |
| `userCart` | [`UserCart`](#classestypes_internal_usercartmd) |

#### Defined in

[src/frontend/features/storageService.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storageService.ts#L14)

___

### storeService

• `Const` **storeService**: [`StoreService`](#classestypes_internal_storeservicemd)

#### Defined in

[src/frontend/features/storeService.ts:169](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/storeService.ts#L169)

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

[src/frontend/features/userSessionService.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/frontend/features/userSessionService.ts#L12)

[fake-pev-shopping](#readmemd) / types

# Module: types

Common types for whole app.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulestypes_internal_md)

### Enumerations

- [HTTP\_STATUS\_CODE](#enumstypeshttp_status_codemd)

### Interfaces

- [IOrder](#interfacestypesiordermd)
- [IPayByLinkMethod](#interfacestypesipaybylinkmethodmd)
- [IProductInOrder](#interfacestypesiproductinordermd)
- [IUserCart](#interfacestypesiusercartmd)

### Type Aliases

- [TPagination](#tpagination)

## Type Aliases

### TPagination

Ƭ **TPagination**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pageNumber` | `number` |
| `productsPerPage` | `number` |

#### Defined in

[commons/types.ts:81](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L81)
