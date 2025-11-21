using System.Linq.Dynamic.Core;
using ShoppingProject.Domain.Common;
using System.Text;

namespace ShoppingProject.Application.Common.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<T> ToDynamic<T>(this IQueryable<T> query, DynamicQuery dynamicQuery)
    {
        if (dynamicQuery == null) return query;

        if (dynamicQuery.Filter != null)
        {
            query = query.ApplyFilter(dynamicQuery.Filter);
        }

        if (dynamicQuery.Sort != null && dynamicQuery.Sort.Any())
        {
            query = query.ApplySort(dynamicQuery.Sort);
        }

        return query;
    }

    private static IQueryable<T> ApplyFilter<T>(this IQueryable<T> query, Filter filter)
    {
        var whereClause = BuildWhereClause(filter);
        if (!string.IsNullOrEmpty(whereClause))
        {
            query = query.Where(whereClause);
        }
        return query;
    }

    private static string BuildWhereClause(Filter filter)
    {
        if (filter == null) return string.Empty;

        var sb = new StringBuilder();

        if (filter.Filters != null && filter.Filters.Any())
        {
            var childFilters = filter.Filters.Select(BuildWhereClause).Where(f => !string.IsNullOrEmpty(f)).ToList();
            if (childFilters.Any())
            {
                var logic = string.IsNullOrEmpty(filter.Logic) ? "and" : filter.Logic;
                sb.Append($"({string.Join($" {logic} ", childFilters)})");
            }
        }
        else if (!string.IsNullOrEmpty(filter.Field))
        {
            var op = GetOperator(filter.Operator);
            var value = filter.Value;
            
            // Basic handling for string/number values
            // Note: This is a simplified implementation and might need adjustment based on actual Filter usage
            if (value != null)
            {
                if (op == "contains")
                {
                    sb.Append($"{filter.Field}.Contains(\"{value}\")");
                }
                else
                {
                    // Handle numeric vs string values? 
                    // System.Linq.Dynamic.Core handles some auto-conversion but quoting strings is safer
                    // Assuming string for simplicity or relying on parser
                    // For now, let's assume string and quote it
                    sb.Append($"{filter.Field} {op} \"{value}\"");
                }
            }
        }

        return sb.ToString();
    }

    private static string GetOperator(string op)
    {
        return op switch
        {
            "eq" => "==",
            "neq" => "!=",
            "gt" => ">",
            "gte" => ">=",
            "lt" => "<",
            "lte" => "<=",
            "contains" => "contains", // Special handling
            _ => "=="
        };
    }

    private static IQueryable<T> ApplySort<T>(this IQueryable<T> query, IEnumerable<Sort> sorts)
    {
        if (sorts == null || !sorts.Any()) return query;

        var ordering = string.Join(",", sorts.Select(s => $"{s.Field} {s.Dir}"));
        return query.OrderBy(ordering);
    }
}
