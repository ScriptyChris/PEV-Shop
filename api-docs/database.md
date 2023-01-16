fake-pev-shopping

# fake-pev-shopping

## Table of contents

### Modules

- [api](#modulesapimd)
- [models](#modulesmodelsmd)
- [populate/populate](#modulespopulate_populatemd)

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

[src/database/utils/paginateItemsFromDB.ts:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/utils/paginateItemsFromDB.ts#L26)

___

### TPaginationConfig

Ƭ **TPaginationConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `limit` | `number` |
| `page` | `number` |

#### Defined in

[src/database/utils/paginateItemsFromDB.ts:25](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/utils/paginateItemsFromDB.ts#L25)

## Functions

### getPaginatedItems

▸ **getPaginatedItems**(`__namedParameters`, `itemQuery`, `projection`): `Promise`<`PaginateResult`<`IProduct` \| `IUser` \| `IUserRole`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.Model` | [`TPaginateModel`](#tpaginatemodel) |
| `__namedParameters.pagination` | [`TPaginationConfig`](#tpaginationconfig) |
| `__namedParameters.sort?` | [`TSort`](#tsort) |
| `itemQuery` | `undefined` \| `MongooseFilterQuery`<`Pick`<`IProduct` \| `IUser` \| `IUserRole`, ``"_id"``\>\> |
| `projection` | `any` |

#### Returns

`Promise`<`PaginateResult`<`IProduct` \| `IUser` \| `IUserRole`\>\>

#### Defined in

[src/database/utils/paginateItemsFromDB.ts:5](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/utils/paginateItemsFromDB.ts#L5)

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
| `modelName` | ``"Product"`` \| ``"User"`` \| ``"User_Role"`` |
| `fieldValue` | `string` \| `RegExp` |

#### Returns

`Promise`<{} & { `deletedCount?`: `number`  }\>

#### Defined in

[src/database/api.ts:150](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/api.ts#L150)

___

### getFromDB

▸ **getFromDB**<`T`\>(`config`, `itemQuery`, `projection?`): `Promise`<`T` \| `ReturnType`<typeof `Model.distinct`\> \| `ReturnType`<typeof [`getPaginatedItems`](#getpaginateditems)\> \| ``null``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `IProduct` \| `IUser` \| `IUserRole` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Object` |
| `config.findMultiple?` | `boolean` |
| `config.isDistinct?` | `boolean` |
| `config.modelName` | ``"Product"`` \| ``"User"`` \| ``"User_Role"`` |
| `config.pagination?` | [`TPaginationConfig`](#tpaginationconfig) |
| `config.population?` | `string` \| `ModelPopulateOptions` \| `ModelPopulateOptions`[] |
| `config.sort?` | [`TSort`](#tsort) |
| `itemQuery` | `string` \| `MongooseFilterQuery`<`Pick`<`unknown`, `never`\>\> |
| `projection?` | `unknown` |

#### Returns

`Promise`<`T` \| `ReturnType`<typeof `Model.distinct`\> \| `ReturnType`<typeof [`getPaginatedItems`](#getpaginateditems)\> \| ``null``\>

#### Defined in

[src/database/api.ts:38](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/api.ts#L38)

___

### saveToDB

▸ **saveToDB**(`modelName`, `itemData`): `Promise`<`IProduct` \| `IUser` \| `IUserRole`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | ``"Product"`` \| ``"User"`` \| ``"User_Role"`` |
| `itemData` | `unknown` |

#### Returns

`Promise`<`IProduct` \| `IUser` \| `IUserRole`\>

#### Defined in

[src/database/api.ts:25](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/api.ts#L25)

___

### updateOneModelInDB

▸ **updateOneModelInDB**(`modelName`, `itemQuery`, `updateData`): `Promise`<``null`` \| `IProduct` \| `IUser` \| `IUserRole`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | ``"Product"`` \| ``"User"`` \| ``"User_Role"`` |
| `itemQuery` | `string` \| `MongooseFilterQuery`<`Pick`<`IProduct`, ``"technicalSpecs"`` \| ``"_id"`` \| ``"name"`` \| ``"url"`` \| ``"category"`` \| ``"price"`` \| ``"shortDescription"`` \| ``"images"`` \| ``"relatedProductsNames"`` \| ``"reviews"`` \| ``"prepareUrlFieldBasedOnNameField"``\>\> \| `MongooseFilterQuery`<`Pick`<`IUser`, ``"_id"`` \| ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"`` \| ``"password"`` \| ``"isConfirmed"`` \| ``"tokens"`` \| ``"accountType"`` \| ``"generateAuthToken"`` \| ``"matchPassword"`` \| ``"setSingleToken"`` \| ``"deleteSingleToken"`` \| ``"confirmUser"`` \| ``"addProductToObserved"`` \| ``"removeProductFromObserved"`` \| ``"removeAllProductsFromObserved"``\>\> \| `MongooseFilterQuery`<`Pick`<`IUserRole`, ``"_id"`` \| ``"roleName"`` \| ``"owners"``\>\> |
| `updateData` | `Object` |
| `updateData.action` | `string` |
| `updateData.data` | `unknown` |

#### Returns

`Promise`<``null`` \| `IProduct` \| `IUser` \| `IUserRole`\>

#### Defined in

[src/database/api.ts:110](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/api.ts#L110)

[fake-pev-shopping](#readmemd) / [models](#modulesmodelsmd) / <internal\>

# Namespace: <internal\>

[models](#modulesmodelsmd).<internal>

[fake-pev-shopping](#readmemd) / models

# Module: models

Groups and re-exports lower level types and values related to working with database'es models.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesmodels_internal_md)

### Type Aliases

- [TCOLLECTION\_NAMES](#tcollection_names)
- [TDocuments](#tdocuments)
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

[src/database/models/__core-and-commons.ts:17](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/__core-and-commons.ts#L17)

___

### TDocuments

Ƭ **TDocuments**: `IProduct` \| `IUser` \| `IUserRole`

#### Defined in

[src/database/models/index.ts:18](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/index.ts#L18)

___

### TProductModel

Ƭ **TProductModel**: typeof [`ProductModel`](#productmodel)

#### Defined in

[src/database/models/_product.ts:155](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_product.ts#L155)

___

### TProductPublic

Ƭ **TProductPublic**: `Pick`<`IProduct`, ``"name"`` \| ``"url"`` \| ``"category"`` \| ``"price"`` \| ``"shortDescription"`` \| ``"technicalSpecs"`` \| ``"relatedProductsNames"``\>

#### Defined in

[src/database/models/_product.ts:157](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_product.ts#L157)

___

### TProductToPopulate

Ƭ **TProductToPopulate**: `Exclude`<`IProduct`, ``"prepareUrlFieldBasedOnNameField"``\>

#### Defined in

[src/database/models/_product.ts:162](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_product.ts#L162)

___

### TSort

Ƭ **TSort**: `Object`

#### Index signature

▪ [key: `string`]: ``1`` \| ``-1``

#### Defined in

[src/database/models/index.ts:19](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/index.ts#L19)

___

### TUserModel

Ƭ **TUserModel**: typeof [`UserModel`](#usermodel)

#### Defined in

[src/database/models/_user.ts:240](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_user.ts#L240)

___

### TUserPublic

Ƭ **TUserPublic**: `Pick`<`IUser`, ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"``\> & { `_id`: `Schema.Types.ObjectId` ; `accountType`: `NonNullable`<`IUser`[``"accountType"``]\>[``"roleName"``]  }

#### Defined in

[src/database/models/_user.ts:242](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_user.ts#L242)

___

### TUserRegistrationCredentials

Ƭ **TUserRegistrationCredentials**: `Pick`<`IUser`, ``"login"`` \| ``"password"`` \| ``"email"``\> & { `repeatedPassword`: `IUser`[``"password"``]  }

#### Defined in

[src/database/models/_user.ts:285](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_user.ts#L285)

___

### TUserRoleModel

Ƭ **TUserRoleModel**: typeof [`UserRoleModel`](#userrolemodel)

#### Defined in

[src/database/models/_userRole.ts:39](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_userRole.ts#L39)

___

### TUserRoleName

Ƭ **TUserRoleName**: keyof typeof [`USER_ROLES_MAP`](#user_roles_map)

#### Defined in

[src/database/models/__core-and-commons.ts:24](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/__core-and-commons.ts#L24)

___

### TUserRoleToPopulate

Ƭ **TUserRoleToPopulate**: `Omit`<`IUserRole`, keyof `Document`\>

#### Defined in

[src/database/models/_userRole.ts:49](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_userRole.ts#L49)

___

### TUserToPopulate

Ƭ **TUserToPopulate**: `Pick`<`IUser`, ``"login"`` \| ``"password"`` \| ``"email"`` \| ``"isConfirmed"``\> & { `__accountType`: [`TUserRoleName`](#tuserrolename)  }

#### Defined in

[src/database/models/_user.ts:247](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_user.ts#L247)

## Variables

### COLLECTION\_NAMES

• `Const` **COLLECTION\_NAMES**: `Readonly`<{ `Product`: ``"Product"`` = 'Product'; `User`: ``"User"`` = 'User'; `User_Role`: ``"User_Role"`` = 'User\_Role' }\>

#### Defined in

[src/database/models/__core-and-commons.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/__core-and-commons.ts#L12)

___

### ProductModel

• `Const` **ProductModel**: `Model`<`IProduct`, {}\>

#### Defined in

[src/database/models/_product.ts:154](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_product.ts#L154)

___

### USER\_ROLES\_MAP

• `Const` **USER\_ROLES\_MAP**: `Readonly`<{ `client`: ``"client"`` = 'client'; `seller`: ``"seller"`` = 'seller' }\>

#### Defined in

[src/database/models/__core-and-commons.ts:20](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/__core-and-commons.ts#L20)

___

### UserModel

• `Const` **UserModel**: `IUserModel`

#### Defined in

[src/database/models/_user.ts:239](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_user.ts#L239)

___

### UserRoleModel

• `Const` **UserRoleModel**: `Model`<`IUserRole`, {}\>

#### Defined in

[src/database/models/_userRole.ts:38](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_userRole.ts#L38)

## Functions

### getModel

▸ **getModel**<`T`\>(`modelName`): { `Product`: `Model`<`IProduct`, {}\> = ProductModel; `User`: `IUserModel` = UserModel; `User_Role`: `Model`<`IUserRole`, {}\> = UserRoleModel }[`T`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"Product"`` \| ``"User"`` \| ``"User_Role"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | `T` |

#### Returns

{ `Product`: `Model`<`IProduct`, {}\> = ProductModel; `User`: `IUserModel` = UserModel; `User_Role`: `Model`<`IUserRole`, {}\> = UserRoleModel }[`T`]

#### Defined in

[src/database/models/index.ts:17](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/index.ts#L17)

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

[src/database/models/__core-and-commons.ts:8](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/__core-and-commons.ts#L8)

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
| `products__InputPath` | ``"./initialData/products.json"`` |
| `user_roles__InputPath` | ``"./initialData/user_roles.json"`` |
| `users__InputPath` | ``"./initialData/users.json"`` |

#### Defined in

[src/database/populate/populate.ts:48](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/populate/populate.ts#L48)

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
| `JSON_FILE_PATH` | { `PRODUCTS`: ``"products__InputPath"`` = 'products\_\_InputPath'; `USERS`: ``"users__InputPath"`` = 'users\_\_InputPath'; `USER_ROLES`: ``"user_roles__InputPath"`` = 'user\_roles\_\_InputPath' } |
| `JSON_FILE_PATH.PRODUCTS` | ``"products__InputPath"`` |
| `JSON_FILE_PATH.USERS` | ``"users__InputPath"`` |
| `JSON_FILE_PATH.USER_ROLES` | ``"user_roles__InputPath"`` |

#### Defined in

[src/database/populate/populate.ts:35](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/populate/populate.ts#L35)

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

[src/database/populate/populate.ts:117](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/populate/populate.ts#L117)
