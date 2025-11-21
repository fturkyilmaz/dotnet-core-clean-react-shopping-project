using System.Linq.Dynamic.Core;
using ShoppingProject.Domain.Common;
using System.Text;
using System.Reflection;

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
        var whereClause = BuildWhereClause(filter, typeof(T));
        if (!string.IsNullOrEmpty(whereClause))
        {
            query = query.Where(whereClause);
        }
        return query;
    }

    private static string BuildWhereClause(Filter filter, Type entityType)
    {
        if (filter == null) return string.Empty;

        var sb = new StringBuilder();

        if (filter.Filters != null && filter.Filters.Any())
        {
            var childFilters = filter.Filters.Select(f => BuildWhereClause(f, entityType)).Where(f => !string.IsNullOrEmpty(f)).ToList();
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
            
            if (value != null)
            {
                var property = entityType.GetProperty(filter.Field, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                var isString = property?.PropertyType == typeof(string);

                if (isString)
                {
                    var safeValue = value.Replace("\"", "\\\"");
                    if (op == "contains")
                    {
                        sb.Append($"({filter.Field} != null && {filter.Field}.ToLower().Contains(\"{safeValue.ToLower()}\"))");
                    }
                    else
                    {
                        sb.Append($"({filter.Field} != null && {filter.Field}.ToLower() {op} \"{safeValue.ToLower()}\")");
                    }
                }
                else
                {
                    // Handle numeric/other types
                    // Assuming value is safe or relying on parser
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
