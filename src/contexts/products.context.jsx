import { createContext, useState, useEffect } from "react";

// should run once using useEffect
//import { addCollectionAndDocuments } from "../utils/firebase/firebase.utils.js";

//import SHOP_DATA from '../shop-data.js';

import { getCategoriesAndDocuments } from "../utils/firebase/firebase.utils";


export const ProductsContext = createContext({
    products: []
});

export const ProductsProvider = ({children}) => {
    const [products, setProducts] = useState([]);

    // useEffect(() => {
    //   addCollectionAndDocuments('categories', SHOP_DATA, 'title');
    // }, [])
    useEffect(() => {
        const getCategoriesMap = async () => {
            const categoriesMap = await getCategoriesAndDocuments();
            console.log(categoriesMap);
            // {hats: Array(9), jackets: Array(5), mens: Array(6), 
            // sneakers: Array(8), womens: Array(7)}
            const categories = Object.keys(categoriesMap);
            // console.log(categories);
        }
        getCategoriesMap();
    }, [])
    
    const value = { products };
    return (
        <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
    );
}