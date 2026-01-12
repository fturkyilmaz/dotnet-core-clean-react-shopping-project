using AutoMapper;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Mappings;

public class AuditLogMappingProfile : Profile
{
    public AuditLogMappingProfile()
    {
        CreateMap<AuditLog, AuditLogDto>();
    }
}
