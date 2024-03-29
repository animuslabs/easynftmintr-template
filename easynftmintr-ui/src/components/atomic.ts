import { endpoints } from "./config"
import { APIClient, Name } from "@greymass/eosio"
import { ObjectSchema, deserialize } from "atomicassets"

interface TemplateRow {
  template_id:string;
  schema_name:string;
  transferable:boolean;
  burnable:boolean;
  max_supply:number;
  issued_supply:number;
  immutable_serialized_data:any;
  collection_name:string;
}

export interface ExtendedTemplateRow extends TemplateRow {
  ipfsHash:string;
  price:any;
}

export interface AssetRow {
  asset_id:string;
  collection_name:string;
  schema_name:string;
  template_id:string;
  ram_payer:string;
  backed_tokens:[];
  immutable_serialized_data:Uint8Array;
  mutable_serialized_data:Uint8Array;
  ipfsHash:string;
}

interface FormatData {
  name:string;
  type:string;
}

export interface SchemaData {
  schema_name:string;
  format:FormatData[];
}

interface TemplatesPrices {
  template_id:string,
  price:number
  schema_name:string,
  collection_name:string
}
// Connect to the EOSIO node
const client = new APIClient({ url: endpoints[2][1] })

export const collections:string[] = ["meownfttest1"]

const code = "atomicassets" // contract account name
export const nftmintcontract = "easynftmintr" // contract account name for minting NFTs
const nftmintcontracttable = "nfts" // contract table name for mintable NFTs
// tables
const tableTemplate = "templates"
const tableSchema = "schemas"
const tableAssets = "assets"

// STEP 1 - Get all schemas for all collections using array of collections
async function getSchemas(
  scope:string,
  code:string,
  table:string
):Promise<any> {
  const result = await client.v1.chain.get_table_rows({
    scope,
    code,
    table,
    json: true
  })

  return result.rows
}

export async function getAllSchemas():Promise<SchemaData[]> {
  const allSchemas:any[] = []

  for (const collection of collections) {
    const schemas = await getSchemas(collection, code, tableSchema)
    allSchemas.push(...schemas)
  }

  return allSchemas
}

// STEP 2 - get all templates for a collection
async function getTemplates(
  collections:string[],
  code:string,
  table:string
):Promise<TemplateRow[]> {
  const allTemplates:TemplateRow[] = []

  for (const collection of collections) {
    let more = true
    let lowerBound:Name | undefined

    while (more) {
      const result:any = await client.v1.chain.get_table_rows({
        scope: collection,
        code,
        table,
        json: true,
        limit: 100,
        lower_bound: lowerBound
      })

      const rowsWithCollectionName = result.rows.map((row:any) => ({
        ...row,
        collection_name: collection // Add this line
      }))
      allTemplates.push(...rowsWithCollectionName)

      if (result.more) {
        lowerBound = result.next_key
      } else {
        more = false
      }
    }
  }

  return allTemplates
}

// get templates prices
async function getTemplatesPrice(scope:string, code:string, table:string):Promise<TemplatesPrices[]> {
  const allTemplatePrices:TemplatesPrices[] = []
  let more = true
  let lowerBound:Name | undefined

  while (more) {
    const result = await client.v1.chain.get_table_rows({
      scope,
      code,
      table,
      json: true,
      limit: 100,
      lower_bound: lowerBound
    })

    allTemplatePrices.push(...result.rows)

    if (result.more) {
      lowerBound = result.next_key
    } else {
      more = false
    }
  }

  return allTemplatePrices
}

// Step 3 - Deserialize templates data
async function deserializeTemplatesData(collections:string[]):Promise<TemplateRow[]> {
  const deserializedTemplates:TemplateRow[] = []
  const schemas = await getAllSchemas()
  const templates = await getTemplates(collections, code, tableTemplate)
  console.log("Templates: ", templates)
  console.log("Schemas: ", schemas)
  for (const template of templates) {
    const schema = schemas.find(
      (schema) => schema.schema_name === template.schema_name
    )

    if (schema) {
      const schemaFormat = ObjectSchema(schema.format)
      const deserializedImmutableData = deserialize(
        template.immutable_serialized_data,
        schemaFormat
      )

      const deserializedTemplate:TemplateRow = {
        ...template,
        immutable_serialized_data: deserializedImmutableData
      }

      deserializedTemplates.push(deserializedTemplate)
    } else {
      console.log(`No schema found for template: ${template.template_id}`)
    }
  }

  return deserializedTemplates
}

// STEP 6 - exctract ipfs hash from templates
export async function extractIpfsHashFromTemplates(collections:string[]):Promise<ExtendedTemplateRow[]> {
  const deserializedTemplates = await deserializeTemplatesData(collections)
  const templatesWithIpfsHash:ExtendedTemplateRow[] = []
  const templatesPrices = await getTemplatesPrice(nftmintcontract, nftmintcontract, nftmintcontracttable)
  for (const template of deserializedTemplates) {
    // Extract IPFS hash from deserialized immutable data
    const ipfsHash = template.immutable_serialized_data.img

    // Find price for the current template
    const templatePrice = templatesPrices.find(
      (price) => price.template_id === template.template_id
    )
    const price = templatePrice ? templatePrice.price : 0

    // Add IPFS hash to template
    const templateWithIpfsHash:ExtendedTemplateRow = {
      ...template,
      ipfsHash,
      collection_name: template.collection_name,
      price
    }

    templatesWithIpfsHash.push(templateWithIpfsHash)
  }

  return templatesWithIpfsHash
}

// STEP 4 - Get all assets for an account, filtered by collections
async function getAssets(
  accountName:string,
  code:string,
  table:string
):Promise<AssetRow[]> {
  let more = true
  let lowerBound:Name | undefined
  const allAssets:any[] = []

  while (more) {
    const result:any = await client.v1.chain.get_table_rows({
      scope: accountName,
      code,
      table,
      json: true,
      limit: 100,
      lower_bound: lowerBound
    })

    allAssets.push(...result.rows)

    if (result.more) {
      lowerBound = result.next_key
    } else {
      more = false
    }
  }

  return allAssets
}

async function getAssetsFromCollections(
  accountName:string,
  code:string,
  table:string,
  collections:string[]
):Promise<AssetRow[]> {
  const allAssets = await getAssets(accountName, code, table)
  const filteredAssets = allAssets.filter((asset) =>
    collections.includes(asset.collection_name)
  )
  return filteredAssets
}

// STEP 5 - Deserialize assets data
export async function mergeTemplatesAndAssets(accountName:string, collections:string[]):Promise<AssetRow[]> {
  const deserializedTemplates = await deserializeTemplatesData(collections)
  const schemas = await getAllSchemas()
  const assets = await getAssetsFromCollections(accountName, code, tableAssets, collections)
  const mergedData:AssetRow[] = []

  for (const asset of assets) {
    const template = deserializedTemplates.find((template) => template.template_id === asset.template_id)
    const schema = schemas.find((schema) => schema.schema_name === asset.schema_name)

    if (template && schema) {
      const schemaFormat = ObjectSchema(schema.format)
      let deserializedTemplateData = template.immutable_serialized_data
      let deserializedAssetData = deserialize(asset.immutable_serialized_data, schemaFormat)
      // Combine the template and asset data, with the asset's data taking precedence
      let mergedImmutableData = { ...deserializedTemplateData, ...deserializedAssetData }
      const mergedAsset:AssetRow = {
        ...asset,
        immutable_serialized_data: mergedImmutableData,
        ipfsHash: mergedImmutableData.img
      }
      console.log(mergedAsset)
      mergedData.push(mergedAsset)
    } else {
      console.log(`No template or schema found for asset: ${asset.asset_id}`)
    }
  }

  return mergedData
}
