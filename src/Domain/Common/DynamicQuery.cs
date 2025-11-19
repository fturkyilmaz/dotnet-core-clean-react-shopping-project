namespace ShoppingProject.Domain.Common;

public class DynamicQuery
{
    public IEnumerable<Sort>? Sort { get; set; }
    public Filter? Filter { get; set; }

    public DynamicQuery()
    {
    }

    public DynamicQuery(IEnumerable<Sort>? sort, Filter? filter)
    {
        Sort = sort;
        Filter = filter;
    }
}

public class Sort
{
    public string Field { get; set; }
    public string Dir { get; set; }

    public Sort()
    {
        Field = string.Empty;
        Dir = string.Empty;
    }

    public Sort(string field, string dir)
    {
        Field = field;
        Dir = dir;
    }
}

public class Filter
{
    public string Field { get; set; }
    public string? Value { get; set; }
    public string Operator { get; set; }
    public string? Logic { get; set; }
    public IEnumerable<Filter>? Filters { get; set; }

    public Filter()
    {
        Field = string.Empty;
        Operator = string.Empty;
    }

    public Filter(string field, string operatorValue)
    {
        Field = field;
        Operator = operatorValue;
    }
}
