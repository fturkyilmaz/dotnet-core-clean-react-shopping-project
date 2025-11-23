# Code Examples

## C# Client Example

```csharp
using System.Net.Http.Json;

var client = new HttpClient();
client.BaseAddress = new Uri("http://localhost:5000");
client.DefaultRequestHeaders.Add("X-Api-Key", "your-api-key");

var products = await client.GetFromJsonAsync<List<Product>>("/api/v1/products");
```

## cURL Example

```bash
curl -X GET "http://localhost:5000/api/v1/products" \
     -H "X-Api-Key: your-api-key"
```
