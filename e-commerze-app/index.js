import { ApolloServer, gql } from "apollo-server";

import { products } from "./db.js"
import { categories } from "./db.js"

// String, Int, Float, Boolean  ==> Scalar Types

const typeDefs = gql`
type Query {
    products : [Product!]!
    product(id : ID!) : Product
    categories : [Category!]!
    category(id : ID!) : Category
   

}

type Product {
    id : ID!
    name : String!
    description : String!
    quantity : Int!
    price : Float!
    onSale : Boolean!
    category : Category
}


type Category {
    id : ID!
    name : String!
    products : [Product!]!
}

`

const resolvers = {
    Query: {
        products: () => products,
        product: (parent, args, context) => {
            const { id } = args;
            return products.find(product => product.id === id);
        },

        categories: (parent, args, context) => categories,
        category: (parent, args, context) => {

            const { id } = args;   //that means  ==>    const categoryID = args.id 
            return categories.find((category) => category.id === id)
        }

    },

    Category: {
        products: (parent, args, context) => {

            const categoryId = parent.id;
            return products.filter((product) => product.categoryId === categoryId)
        },
    },

    Product: {
        category: (parent, args, context) => {
            const categoryId = parent.categoryId;
            return categories.find((category) => category.id === categoryId);
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log("Server is ready at " + url);
});