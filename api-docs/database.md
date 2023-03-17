fake-pev-shopping

# fake-pev-shopping

## Table of contents

### Modules

- [api](#modulesapimd)
- [models](#modulesmodelsmd)
- [populate/populate](#modulespopulate_populatemd)

[fake-pev-shopping](#readmemd) / [models](#modulesmodelsmd) / IOrder

# Interface: IOrder

[models](#modulesmodelsmd).IOrder

## Hierarchy

- `Document`

- `Pick`<[`IOrderPayload`](#interfacesmodels_internal_iorderpayloadmd), ``"receiver"``\>

  ↳ **`IOrder`**

## Table of contents

### Properties

- [cost](#cost)
- [payment](#payment)
- [receiver](#receiver)
- [regardingProducts](#regardingproducts)
- [regardingUser](#regardinguser)
- [shipment](#shipment)
- [timestamp](#timestamp)

## Properties

### cost

• `Optional` **cost**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `products` | `number` |
| `shipment` | `number` |
| `total` | `number` |

#### Defined in

[src/database/models/_order.ts:185](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L185)

___

### payment

• **payment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `method` | ``"cash"`` \| ``"card"`` \| ``"transfer"`` \| ``"blik"`` |

#### Defined in

[src/database/models/_order.ts:190](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L190)

___

### receiver

• **receiver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `name` | `string` |
| `phone` | `string` |

#### Overrides

Pick.receiver

#### Defined in

[src/database/models/_order.ts:184](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L184)

___

### regardingProducts

• **regardingProducts**: [`IProductInOrder`](#interfacesmodels_internal_iproductinordermd)[]

#### Defined in

[src/database/models/_order.ts:198](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L198)

___

### regardingUser

• **regardingUser**: `ObjectId`

#### Defined in

[src/database/models/_order.ts:197](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L197)

___

### shipment

• **shipment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `method` | ``"inPerson"`` \| ``"home"`` \| ``"parcelLocker"`` |
| `price?` | `number` |

#### Defined in

[src/database/models/_order.ts:193](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L193)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/database/models/_order.ts:183](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L183)

[fake-pev-shopping](#readmemd) / [models](#modulesmodelsmd) / IProduct

# Interface: IProduct

[models](#modulesmodelsmd).IProduct

## Hierarchy

- `Document`

  ↳ **`IProduct`**

## Table of contents

### Properties

- [availability](#availability)
- [category](#category)
- [createdAt](#createdat)
- [images](#images)
- [name](#name)
- [orderedUnits](#orderedunits)
- [price](#price)
- [relatedProductsNames](#relatedproductsnames)
- [reviews](#reviews)
- [shortDescription](#shortdescription)
- [technicalSpecs](#technicalspecs)
- [url](#url)

### Methods

- [addReview](#addreview)
- [prepareUrlField](#prepareurlfield)
- [transformImagesToImagePaths](#transformimagestoimagepaths)
- [validateReviewDuplicatedAuthor](#validatereviewduplicatedauthor)

## Properties

### availability

• **availability**: `number`

#### Defined in

[src/database/models/_product.ts:500](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L500)

___

### category

• **category**: `string`

#### Defined in

[src/database/models/_product.ts:489](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L489)

___

### createdAt

• **createdAt**: `number`

#### Defined in

[src/database/models/_product.ts:502](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L502)

___

### images

• **images**: { `name`: `string` ; `src`: `string`  }[]

#### Defined in

[src/database/models/_product.ts:497](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L497)

___

### name

• **name**: `string`

#### Defined in

[src/database/models/_product.ts:487](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L487)

___

### orderedUnits

• **orderedUnits**: `number`

#### Defined in

[src/database/models/_product.ts:501](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L501)

___

### price

• **price**: `number`

#### Defined in

[src/database/models/_product.ts:490](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L490)

___

### relatedProductsNames

• **relatedProductsNames**: `string`[]

#### Defined in

[src/database/models/_product.ts:498](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L498)

___

### reviews

• **reviews**: `IReviews`

#### Defined in

[src/database/models/_product.ts:499](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L499)

___

### shortDescription

• **shortDescription**: `string`[]

#### Defined in

[src/database/models/_product.ts:491](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L491)

___

### technicalSpecs

• **technicalSpecs**: { `data`: `unknown` ; `defaultUnit`: `string` ; `heading`: `string`  }[]

#### Defined in

[src/database/models/_product.ts:492](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L492)

___

### url

• **url**: `string`

#### Defined in

[src/database/models/_product.ts:488](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L488)

## Methods

### addReview

▸ **addReview**(`newReviewEntry`, `reviewAuthor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newReviewEntry` | `IReviewItem` |
| `reviewAuthor` | `string` |

#### Returns

`void`

#### Defined in

[src/database/models/_product.ts:509](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L509)

___

### prepareUrlField

▸ **prepareUrlField**(): `void`

#### Returns

`void`

#### Defined in

[src/database/models/_product.ts:504](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L504)

___

### transformImagesToImagePaths

▸ **transformImagesToImagePaths**(): `void`

#### Returns

`void`

#### Defined in

[src/database/models/_product.ts:505](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L505)

___

### validateReviewDuplicatedAuthor

▸ **validateReviewDuplicatedAuthor**(`reviewAuthor`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `reviewAuthor` | `string` |

#### Returns

`boolean`

#### Defined in

[src/database/models/_product.ts:506](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L506)

[fake-pev-shopping](#readmemd) / [models](#modulesmodelsmd) / [<internal\>](#modulesmodels_internal_md) / IOrderModel

# Interface: IOrderModel

[models](#modulesmodelsmd).[<internal>](#modulesmodels_internal_md).IOrderModel

## Hierarchy

- `Model`<[`IOrder`](#interfacesmodelsiordermd)\>

  ↳ **`IOrderModel`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Methods

- [createOrder](#createorder)
- [execPopulate](#execpopulate)
- [populated](#populated)

## Constructors

### constructor

• **new IOrderModel**(`doc?`)

Model constructor
Provides the interface to MongoDB collections as well as creates document instances.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `doc?` | `any` | values with which to create the document |

#### Inherited from

Model<IOrder\>.constructor

#### Defined in

node_modules/@types/mongoose/index.d.ts:3225

## Methods

### createOrder

▸ **createOrder**(`orderPayload`, `products`, `regardingUser`): [`IOrder`](#interfacesmodelsiordermd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderPayload` | [`IOrderPayload`](#interfacesmodels_internal_iorderpayloadmd) |
| `products` | [`IProductInOrder`](#interfacesmodels_internal_iproductinordermd)[] |
| `regardingUser` | `ObjectId` |

#### Returns

[`IOrder`](#interfacesmodelsiordermd)

#### Defined in

[src/database/models/_order.ts:175](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L175)

___

### execPopulate

▸ **execPopulate**(`path`): [`IOrderModel`](#interfacesmodels_internal_iordermodelmd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

[`IOrderModel`](#interfacesmodels_internal_iordermodelmd)

#### Inherited from

Model.execPopulate

#### Defined in

[src/augmentations.d.ts:27](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/augmentations.d.ts#L27)

▸ **execPopulate**(`options`): [`IOrderModel`](#interfacesmodels_internal_iordermodelmd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ModelPopulateOptions` \| `ModelPopulateOptions`[] |

#### Returns

[`IOrderModel`](#interfacesmodels_internal_iordermodelmd)

#### Inherited from

Model.execPopulate

#### Defined in

[src/augmentations.d.ts:28](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/augmentations.d.ts#L28)

___

### populated

▸ **populated**(`path`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`any`

#### Inherited from

Model.populated

#### Defined in

[src/augmentations.d.ts:29](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/augmentations.d.ts#L29)

[fake-pev-shopping](#readmemd) / [models](#modulesmodelsmd) / [<internal\>](#modulesmodels_internal_md) / IOrderPayload

# Interface: IOrderPayload

[models](#modulesmodelsmd).[<internal>](#modulesmodels_internal_md).IOrderPayload

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

[commons/types.ts:78](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/commons/types.ts#L78)

___

### products

• **products**: `Pick`<[`IProductInOrder`](#interfacesmodels_internal_iproductinordermd), ``"id"`` \| ``"quantity"``\>[]

#### Defined in

[commons/types.ts:85](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/commons/types.ts#L85)

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

[commons/types.ts:73](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/commons/types.ts#L73)

___

### shipment

• **shipment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `method` | ``"inPerson"`` \| ``"home"`` \| ``"parcelLocker"`` |

#### Defined in

[commons/types.ts:81](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/commons/types.ts#L81)

[fake-pev-shopping](#readmemd) / [models](#modulesmodelsmd) / [<internal\>](#modulesmodels_internal_md) / IProductInOrder

# Interface: IProductInOrder

[models](#modulesmodelsmd).[<internal>](#modulesmodels_internal_md).IProductInOrder

## Table of contents

### Properties

- [id](#id)
- [quantity](#quantity)
- [unitPrice](#unitprice)

## Properties

### id

• **id**: `ObjectId`

#### Defined in

[commons/types.ts:28](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/commons/types.ts#L28)

___

### quantity

• **quantity**: `number`

#### Defined in

[commons/types.ts:30](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/commons/types.ts#L30)

___

### unitPrice

• **unitPrice**: `number`

#### Defined in

[commons/types.ts:29](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/commons/types.ts#L29)

[fake-pev-shopping](#readmemd) / [api](#modulesapimd) / <internal\>

# Namespace: <internal\>

[api](#modulesapimd).<internal>

## Table of contents

### Type Aliases

- [TPaginateModel](#tpaginatemodel)
- [TPaginationConfig](#tpaginationconfig)

### Functions

- [getPaginatedItems](#getpaginateditems)

## Type Aliases

### TPaginateModel

Ƭ **TPaginateModel**: `PaginateModel`<[`TDocuments`](#tdocuments)\>

#### Defined in

[src/database/utils/paginateItemsFromDB.ts:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/utils/paginateItemsFromDB.ts#L26)

___

### TPaginationConfig

Ƭ **TPaginationConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `limit` | `number` |
| `page` | `number` |

#### Defined in

[src/database/utils/paginateItemsFromDB.ts:25](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/utils/paginateItemsFromDB.ts#L25)

## Functions

### getPaginatedItems

▸ **getPaginatedItems**(`__namedParameters`, `itemQuery`, `projection`): `Promise`<`PaginateResult`<[`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.Model` | [`TPaginateModel`](#tpaginatemodel) |
| `__namedParameters.pagination` | [`TPaginationConfig`](#tpaginationconfig) |
| `__namedParameters.sort?` | [`TSort`](#tsort) |
| `itemQuery` | `undefined` \| `MongooseFilterQuery`<`Pick`<[`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole`, ``"_id"``\>\> |
| `projection` | `any` |

#### Returns

`Promise`<`PaginateResult`<[`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole`\>\>

#### Defined in

[src/database/utils/paginateItemsFromDB.ts:5](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/utils/paginateItemsFromDB.ts#L5)

[fake-pev-shopping](#readmemd) / api

# Module: api

Facade over database CRUD operations.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesapi_internal_md)

### Functions

- [deleteFromDB](#deletefromdb)
- [getFromDB](#getfromdb)
- [saveToDB](#savetodb)
- [updateOneModelInDB](#updateonemodelindb)

## Functions

### deleteFromDB

▸ **deleteFromDB**(`modelName`, `fieldValue`): `Promise`<{} & { `deletedCount?`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | ``"Product"`` \| ``"Order"`` \| ``"User"`` \| ``"User_Role"`` |
| `fieldValue` | `string` \| `RegExp` \| `Record`<`never`, `never`\> |

#### Returns

`Promise`<{} & { `deletedCount?`: `number`  }\>

#### Defined in

[src/database/api.ts:150](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/api.ts#L150)

___

### getFromDB

▸ **getFromDB**<`T`\>(`config`, `itemQuery`, `projection?`): `Promise`<`T` \| `ReturnType`<typeof `Model.distinct`\> \| `ReturnType`<typeof [`getPaginatedItems`](#getpaginateditems)\> \| ``null``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Object` |
| `config.findMultiple?` | `boolean` |
| `config.isDistinct?` | `boolean` |
| `config.modelName` | ``"Product"`` \| ``"Order"`` \| ``"User"`` \| ``"User_Role"`` |
| `config.pagination?` | [`TPaginationConfig`](#tpaginationconfig) |
| `config.population?` | `string` \| `ModelPopulateOptions` \| `ModelPopulateOptions`[] |
| `config.sort?` | [`TSort`](#tsort) |
| `itemQuery` | `string` \| `MongooseFilterQuery`<`Pick`<`unknown`, `never`\>\> |
| `projection?` | `unknown` |

#### Returns

`Promise`<`T` \| `ReturnType`<typeof `Model.distinct`\> \| `ReturnType`<typeof [`getPaginatedItems`](#getpaginateditems)\> \| ``null``\>

#### Defined in

[src/database/api.ts:38](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/api.ts#L38)

___

### saveToDB

▸ **saveToDB**(`modelName`, `itemData`): `Promise`<[`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | ``"Product"`` \| ``"Order"`` \| ``"User"`` \| ``"User_Role"`` |
| `itemData` | `unknown` |

#### Returns

`Promise`<[`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole`\>

#### Defined in

[src/database/api.ts:25](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/api.ts#L25)

___

### updateOneModelInDB

▸ **updateOneModelInDB**(`modelName`, `itemQuery`, `updateData`): `Promise`<``null`` \| [`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | ``"Product"`` \| ``"Order"`` \| ``"User"`` \| ``"User_Role"`` |
| `itemQuery` | `string` \| `MongooseFilterQuery`<`Pick`<[`IProduct`](#interfacesmodelsiproductmd), ``"technicalSpecs"`` \| ``"_id"`` \| ``"name"`` \| ``"url"`` \| ``"category"`` \| ``"price"`` \| ``"shortDescription"`` \| ``"images"`` \| ``"relatedProductsNames"`` \| ``"reviews"`` \| ``"availability"`` \| ``"orderedUnits"`` \| ``"createdAt"`` \| ``"prepareUrlField"`` \| ``"transformImagesToImagePaths"`` \| ``"validateReviewDuplicatedAuthor"`` \| ``"addReview"``\>\> \| `MongooseFilterQuery`<`Pick`<[`IOrder`](#interfacesmodelsiordermd), ``"_id"`` \| ``"receiver"`` \| ``"timestamp"`` \| ``"cost"`` \| ``"payment"`` \| ``"shipment"`` \| ``"regardingUser"`` \| ``"regardingProducts"``\>\> \| `MongooseFilterQuery`<`Pick`<`IUser`, ``"_id"`` \| ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"`` \| ``"password"`` \| ``"isConfirmed"`` \| ``"tokens"`` \| ``"accountType"`` \| ``"generateAuthToken"`` \| ``"matchPassword"`` \| ``"setSingleToken"`` \| ``"deleteSingleToken"`` \| ``"confirmUser"`` \| ``"addProductToObserved"`` \| ``"removeProductFromObserved"`` \| ``"removeAllProductsFromObserved"`` \| ``"findCurrentUserOrders"`` \| ``"findAllUsersOrders"``\>\> \| `MongooseFilterQuery`<`Pick`<`IUserRole`, ``"_id"`` \| ``"roleName"`` \| ``"owners"``\>\> |
| `updateData` | `Object` |
| `updateData.action` | `string` |
| `updateData.data` | `unknown` |

#### Returns

`Promise`<``null`` \| [`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole`\>

#### Defined in

[src/database/api.ts:110](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/api.ts#L110)

[fake-pev-shopping](#readmemd) / [models](#modulesmodelsmd) / <internal\>

# Namespace: <internal\>

[models](#modulesmodelsmd).<internal>

## Table of contents

### Interfaces

- [IOrderModel](#interfacesmodels_internal_iordermodelmd)
- [IOrderPayload](#interfacesmodels_internal_iorderpayloadmd)
- [IProductInOrder](#interfacesmodels_internal_iproductinordermd)

### Type Aliases

- [TFiles](#tfiles)

## Type Aliases

### TFiles

Ƭ **TFiles**: `Parameters`<`NonNullable`<`Parameters`<`ReturnType`<typeof `formidable`\>[``"parse"``]\>[``1``]\>\>[``2``]

#### Defined in

[src/middleware/helpers/form-data-handler.ts:7](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/middleware/helpers/form-data-handler.ts#L7)

[fake-pev-shopping](#readmemd) / models

# Module: models

Groups and re-exports lower level types and values related to working with database'es models.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesmodels_internal_md)

### Interfaces

- [IOrder](#interfacesmodelsiordermd)
- [IProduct](#interfacesmodelsiproductmd)

### Type Aliases

- [TCOLLECTION\_NAMES](#tcollection_names)
- [TDocuments](#tdocuments)
- [TOrderToPopulate](#tordertopopulate)
- [TProductModel](#tproductmodel)
- [TProductPublic](#tproductpublic)
- [TProductToPopulate](#tproducttopopulate)
- [TSort](#tsort)
- [TUserModel](#tusermodel)
- [TUserPublic](#tuserpublic)
- [TUserRegistrationCredentials](#tuserregistrationcredentials)
- [TUserRoleModel](#tuserrolemodel)
- [TUserRoleName](#tuserrolename)
- [TUserRoleToPopulate](#tuserroletopopulate)
- [TUserToPopulate](#tusertopopulate)

### Variables

- [COLLECTION\_NAMES](#collection_names)
- [OrderModel](#ordermodel)
- [ProductModel](#productmodel)
- [USER\_ROLES\_MAP](#user_roles_map)
- [UserModel](#usermodel)
- [UserRoleModel](#userrolemodel)

### Functions

- [getModel](#getmodel)
- [isValidObjectId](#isvalidobjectid)

## Type Aliases

### TCOLLECTION\_NAMES

Ƭ **TCOLLECTION\_NAMES**: keyof typeof [`COLLECTION_NAMES`](#collection_names)

#### Defined in

[src/database/models/__core-and-commons.ts:18](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/__core-and-commons.ts#L18)

___

### TDocuments

Ƭ **TDocuments**: [`IProduct`](#interfacesmodelsiproductmd) \| [`IOrder`](#interfacesmodelsiordermd) \| `IUser` \| `IUserRole`

#### Defined in

[src/database/models/index.ts:20](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/index.ts#L20)

___

### TOrderToPopulate

Ƭ **TOrderToPopulate**: [`IOrder`](#interfacesmodelsiordermd) & { `__regardingUser`: `string` ; `regardingProducts`: [`IOrder`](#interfacesmodelsiordermd)[``"regardingProducts"``][`number`] & { `__name`: `string`  }[]  }

#### Defined in

[src/database/models/_order.ts:169](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L169)

___

### TProductModel

Ƭ **TProductModel**: typeof [`ProductModel`](#productmodel)

#### Defined in

[src/database/models/_product.ts:422](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L422)

___

### TProductPublic

Ƭ **TProductPublic**: `Pick`<[`IProduct`](#interfacesmodelsiproductmd), ``"name"`` \| ``"url"`` \| ``"category"`` \| ``"price"`` \| ``"shortDescription"`` \| ``"technicalSpecs"`` \| ``"images"`` \| ``"relatedProductsNames"``\>

#### Defined in

[src/database/models/_product.ts:424](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L424)

___

### TProductToPopulate

Ƭ **TProductToPopulate**: `Exclude`<[`IProduct`](#interfacesmodelsiproductmd), ``"prepareUrlField"`` \| ``"transformImagesToImagePaths"``\>

#### Defined in

[src/database/models/_product.ts:429](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L429)

___

### TSort

Ƭ **TSort**: `Object`

#### Index signature

▪ [key: `string`]: ``1`` \| ``-1``

#### Defined in

[src/database/models/index.ts:21](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/index.ts#L21)

___

### TUserModel

Ƭ **TUserModel**: typeof [`UserModel`](#usermodel)

#### Defined in

[src/database/models/_user.ts:304](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_user.ts#L304)

___

### TUserPublic

Ƭ **TUserPublic**: `Pick`<`IUser`, ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"``\> & { `_id`: `Types.ObjectId` ; `accountType`: `NonNullable`<`IUser`[``"accountType"``]\>[``"roleName"``]  }

#### Defined in

[src/database/models/_user.ts:306](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_user.ts#L306)

___

### TUserRegistrationCredentials

Ƭ **TUserRegistrationCredentials**: `Pick`<`IUser`, ``"login"`` \| ``"password"`` \| ``"email"``\> & { `repeatedPassword`: `IUser`[``"password"``]  }

#### Defined in

[src/database/models/_user.ts:352](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_user.ts#L352)

___

### TUserRoleModel

Ƭ **TUserRoleModel**: typeof [`UserRoleModel`](#userrolemodel)

#### Defined in

[src/database/models/_userRole.ts:39](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_userRole.ts#L39)

___

### TUserRoleName

Ƭ **TUserRoleName**: keyof typeof [`USER_ROLES_MAP`](#user_roles_map)

#### Defined in

[src/database/models/__core-and-commons.ts:25](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/__core-and-commons.ts#L25)

___

### TUserRoleToPopulate

Ƭ **TUserRoleToPopulate**: `Omit`<`IUserRole`, keyof `Document`\>

#### Defined in

[src/database/models/_userRole.ts:49](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_userRole.ts#L49)

___

### TUserToPopulate

Ƭ **TUserToPopulate**: `Pick`<`IUser`, ``"login"`` \| ``"password"`` \| ``"email"`` \| ``"isConfirmed"``\> & { `__accountType`: [`TUserRoleName`](#tuserrolename)  }

#### Defined in

[src/database/models/_user.ts:311](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_user.ts#L311)

## Variables

### COLLECTION\_NAMES

• `Const` **COLLECTION\_NAMES**: `Readonly`<{ `Order`: ``"Order"`` = 'Order'; `Product`: ``"Product"`` = 'Product'; `User`: ``"User"`` = 'User'; `User_Role`: ``"User_Role"`` = 'User\_Role' }\>

#### Defined in

[src/database/models/__core-and-commons.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/__core-and-commons.ts#L12)

___

### OrderModel

• `Const` **OrderModel**: [`IOrderModel`](#interfacesmodels_internal_iordermodelmd)

#### Defined in

[src/database/models/_order.ts:168](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_order.ts#L168)

___

### ProductModel

• `Const` **ProductModel**: `IProductModel`

#### Defined in

[src/database/models/_product.ts:421](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_product.ts#L421)

___

### USER\_ROLES\_MAP

• `Const` **USER\_ROLES\_MAP**: `Readonly`<{ `client`: ``"client"`` = 'client'; `seller`: ``"seller"`` = 'seller' }\>

#### Defined in

[src/database/models/__core-and-commons.ts:21](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/__core-and-commons.ts#L21)

___

### UserModel

• `Const` **UserModel**: `IUserModel`

#### Defined in

[src/database/models/_user.ts:303](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_user.ts#L303)

___

### UserRoleModel

• `Const` **UserRoleModel**: `Model`<`IUserRole`, {}\>

#### Defined in

[src/database/models/_userRole.ts:38](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/_userRole.ts#L38)

## Functions

### getModel

▸ **getModel**<`T`\>(`modelName`): { `Order`: [`IOrderModel`](#interfacesmodels_internal_iordermodelmd) = OrderModel; `Product`: `IProductModel` = ProductModel; `User`: `IUserModel` = UserModel; `User_Role`: `Model`<`IUserRole`, {}\> = UserRoleModel }[`T`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"Product"`` \| ``"Order"`` \| ``"User"`` \| ``"User_Role"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | `T` |

#### Returns

{ `Order`: [`IOrderModel`](#interfacesmodels_internal_iordermodelmd) = OrderModel; `Product`: `IProductModel` = ProductModel; `User`: `IUserModel` = UserModel; `User_Role`: `Model`<`IUserRole`, {}\> = UserRoleModel }[`T`]

#### Defined in

[src/database/models/index.ts:19](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/index.ts#L19)

___

### isValidObjectId

▸ **isValidObjectId**(`value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

[src/database/models/__core-and-commons.ts:8](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/models/__core-and-commons.ts#L8)

[fake-pev-shopping](#readmemd) / populate/populate

# Module: populate/populate

Populates database with indicated initial data, optionally doing a cleanup beforehand.

**`example`** npm usage
```sh
npm run populate-db
```

**`example`** Manual CLI usage
```sh
ts-node src/database/populate/populate.tspopulate.ts \
   executedFromCLI=true \
   products__InputPath=path/to/JSON/with/initial/products/data
```

## Table of contents

### Variables

- [DEFAULT\_PARAMS](#default_params)
- [PARAMS](#params)

### Functions

- [executeDBPopulation](#executedbpopulation)

## Variables

### DEFAULT\_PARAMS

• `Const` **DEFAULT\_PARAMS**: `Object`

Maps default params, which are applied when regarding individual params are not provided via CLI.

**`notexported`**

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cleanAllBefore` | ``"true"`` |
| `orders__InputPath` | ``"./initialData/orders.json"`` |
| `product_images__FolderPath` | ``"./initialData/product-images"`` |
| `products__InputPath` | ``"./initialData/products.json"`` |
| `user_roles__InputPath` | ``"./initialData/user_roles.json"`` |
| `users__InputPath` | ``"./initialData/users.json"`` |

#### Defined in

[src/database/populate/populate.ts:50](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/populate/populate.ts#L50)

___

### PARAMS

• `Const` **PARAMS**: `Object`

Maps supported params passed via CLI.

**`notexported`**

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CLEAN_ALL_BEFORE` | ``"cleanAllBefore"`` |
| `EXECUTED_FROM_CLI` | ``"executedFromCLI"`` |
| `JSON_FILE_PATH` | { `ORDERS`: ``"orders__InputPath"`` = 'orders\_\_InputPath'; `PRODUCTS`: ``"products__InputPath"`` = 'products\_\_InputPath'; `USERS`: ``"users__InputPath"`` = 'users\_\_InputPath'; `USER_ROLES`: ``"user_roles__InputPath"`` = 'user\_roles\_\_InputPath' } |
| `JSON_FILE_PATH.ORDERS` | ``"orders__InputPath"`` |
| `JSON_FILE_PATH.PRODUCTS` | ``"products__InputPath"`` |
| `JSON_FILE_PATH.USERS` | ``"users__InputPath"`` |
| `JSON_FILE_PATH.USER_ROLES` | ``"user_roles__InputPath"`` |
| `PRODUCT_IMAGES` | ``"product_images__FolderPath"`` |

#### Defined in

[src/database/populate/populate.ts:35](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/populate/populate.ts#L35)

## Functions

### executeDBPopulation

▸ **executeDBPopulation**(`shouldCleanupAll?`): `Promise`<`boolean`\>

Executes database population. May be called from other module or it's automatically called when this script is run from CLI.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `shouldCleanupAll` | `boolean` | `false` | Decides whether do database cleanup. Passing `PARAMS.CLEAN_ALL_BEFORE` via CLI is an alternative way to do cleanup. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/database/populate/populate.ts:134](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/7ad1225/src/database/populate/populate.ts#L134)
