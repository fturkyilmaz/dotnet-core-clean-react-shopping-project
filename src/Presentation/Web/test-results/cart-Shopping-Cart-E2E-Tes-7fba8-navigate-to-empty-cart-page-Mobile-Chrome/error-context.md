# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - generic [ref=e4]:
      - link "🛒 Furkan Store" [ref=e5] [cursor=pointer]:
        - /url: /
      - button "Toggle navigation" [ref=e6] [cursor=pointer]
  - generic [ref=e12]:
    - generic [ref=e13]:
      - heading "Sign In" [level=2] [ref=e14]
      - paragraph [ref=e15]:
        - text: Don't have an account?
        - link "Sign Up" [ref=e16] [cursor=pointer]:
          - /url: /register
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]: Email
        - textbox "Email" [ref=e20]:
          - /placeholder: name@example.com
      - generic [ref=e21]:
        - generic [ref=e22]: Password
        - textbox "Password" [ref=e23]:
          - /placeholder: ••••••••
      - button "Sign In" [ref=e25] [cursor=pointer]
    - generic [ref=e26]:
      - separator [ref=e27]
      - generic [ref=e28]: or
    - button "Continue with Google" [ref=e30] [cursor=pointer]: Continue with Google
```