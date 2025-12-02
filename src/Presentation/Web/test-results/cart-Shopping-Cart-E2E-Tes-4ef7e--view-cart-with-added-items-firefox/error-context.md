# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - generic [ref=e4]:
      - link "🛒 Furkan Store" [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e7]:
        - list [ref=e8]:
          - listitem [ref=e9]:
            - link "Home" [ref=e10] [cursor=pointer]:
              - /url: /
          - listitem [ref=e11]:
            - link "Categories" [ref=e12] [cursor=pointer]:
              - /url: /category
          - listitem [ref=e13]:
            - link "Cart" [ref=e14] [cursor=pointer]:
              - /url: /carts
              - img [ref=e15]
              - text: Cart
        - generic [ref=e17]:
          - button "en" [ref=e19] [cursor=pointer]:
            - img [ref=e20]
            - generic [ref=e22]: en
          - button "Toggle theme" [ref=e23] [cursor=pointer]:
            - img [ref=e24]
          - generic [ref=e26]:
            - link "Sign In" [ref=e27] [cursor=pointer]:
              - /url: /login
            - link "Sign Up" [ref=e28] [cursor=pointer]:
              - /url: /register
  - generic [ref=e29]:
    - generic [ref=e30]:
      - heading "Tüm Ürünler" [level=1] [ref=e31]
      - paragraph [ref=e32]: 0 ürün bulundu
    - generic [ref=e34]:
      - heading "Ürün Bulunamadı" [level=2] [ref=e35]
      - paragraph [ref=e36]: Bu kategoride şu anda ürün bulunmamaktadır.
```