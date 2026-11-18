export interface Product {
  name: string
  type: string
  image: string
  tag: string
  price: number | null
  sizes?: string[]
}

export interface Branch {
  name: string
  address: string
}

export interface Category {
  title: string
  subtitle: string
  image: string
}
