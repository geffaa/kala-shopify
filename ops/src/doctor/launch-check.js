import { checkDiscount, checkProducts } from './launch-rules.js';

const PUBLICATIONS = `query { publications(first: 20) { nodes { id name } } }`;

const COLLECTION_PRODUCTS = `
  query LaunchCheck($handle: String!, $pub: ID!, $after: String) {
    collectionByIdentifier(identifier: { handle: $handle }) {
      title
      products(first: 25, after: $after) {
        nodes {
          title
          status
          publishedOnOnlineStore: publishedOnPublication(publicationId: $pub)
          seo { description }
          options { name }
          media(first: 20) { nodes { alt } }
          sizeChart: metafield(namespace: "kala", key: "size_chart") { id }
          variants(first: 100) {
            nodes {
              title
              price
              compareAtPrice
              inventoryQuantity
              inventoryPolicy
              inventoryItem { tracked measurement { weight { value } } }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }`;

const DISCOUNT = `
  query Discount($code: String!) {
    codeDiscountNodeByCode(code: $code) {
      codeDiscount {
        ... on DiscountCodeBasic { status startsAt endsAt usageLimit asyncUsageCount }
        ... on DiscountCodeBxgy { status startsAt endsAt usageLimit asyncUsageCount }
        ... on DiscountCodeFreeShipping { status startsAt endsAt usageLimit asyncUsageCount }
      }
    }
  }`;

/** Shape Admin API nodes into the plain objects the rules expect. */
export function normalizeProduct(node) {
  return {
    title: node.title,
    status: node.status,
    publishedOnOnlineStore: node.publishedOnOnlineStore,
    seoDescription: node.seo?.description,
    options: node.options,
    hasSizeChart: Boolean(node.sizeChart),
    media: node.media.nodes,
    variants: node.variants.nodes.map((v) => ({
      title: v.title,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      inventoryQuantity: v.inventoryQuantity,
      inventoryPolicy: v.inventoryPolicy,
      tracked: v.inventoryItem?.tracked,
      weight: v.inventoryItem?.measurement?.weight?.value ?? 0,
    })),
  };
}

export async function launchCheck({ admin, collection, launchAt, discounts = [] }) {
  const { publications } = await admin.graphql(PUBLICATIONS);
  const onlineStore = publications.nodes.find((p) => p.name === 'Online Store');
  if (!onlineStore) throw new Error('Online Store publication not found (does the app have read_publications?)');

  let title = collection;
  const products = [];
  for await (const node of admin.paginate(COLLECTION_PRODUCTS, { handle: collection, pub: onlineStore.id }, (d) => {
    if (!d.collectionByIdentifier) throw new Error(`Collection "${collection}" not found`);
    title = d.collectionByIdentifier.title;
    return d.collectionByIdentifier.products;
  })) {
    products.push(normalizeProduct(node));
  }

  const findings = checkProducts(products, { launchAt });
  for (const code of discounts) {
    const { codeDiscountNodeByCode } = await admin.graphql(DISCOUNT, { code });
    findings.push(...checkDiscount(code, codeDiscountNodeByCode?.codeDiscount, { launchAt }));
  }
  if (!products.length) findings.push({ level: 'fail', product: title, rule: 'empty', message: 'Collection has no products.' });
  return { title, products, findings };
}
