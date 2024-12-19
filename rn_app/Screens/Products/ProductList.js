import { TouchableOpacity, View, Dimensions } from "react-native";

import ProductCard from "./ProductCard";

var { width } = Dimensions.get("window");


const ProductList = ({item}) => {
  return (
    <TouchableOpacity style={{ width: '50%' }}>
        <View style={{
            width: width / 2,
            backgroundColor: 'gainsboro'
        }}>
            <ProductCard {...item} />
        </View>
    </TouchableOpacity>
  )
}

export default ProductList
