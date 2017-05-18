using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebApp.Models.VM;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Threading;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class TFContext : DbContext
    {
        internal async Task BoomMethod(decimal maxNumber, string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;

            var arrayWithTeams = await Team
                .Where(t => t.UserId == userId)
                .Include(t => t.Personnel)
                    .ThenInclude(p => p.Competence)
                .Include(t => t.IncludedClass)
                    .ThenInclude(i => i.Class)
                .Include(t => t.StudentGroup)
                .ToArrayAsync();

            List<IncludedClass> classesWithoutCompetentTeachers = new List<IncludedClass>();
            foreach (var team in arrayWithTeams)
            {
                if (team.IncludedClass.Where(t => t.Assigned == false).Count() > 0)
                {
                    foreach (var includedClass in team.IncludedClass.Where(t => t.Assigned == false))
                    {
                        List<Personnel> qualifiedTeachers = new List<Personnel>();
                        List<Personnel> unqualifiedTeachers = new List<Personnel>();
                        bool match = false;
                        foreach (var person in team.Personnel)
                        {
                            if (((person.AvailablePoints * (maxNumber / 100.0m)) - person.AssignedPoints) >= includedClass.Class.Points)
                            {
                                if (person.Competence.Count() > 0)
                                {
                                    foreach (var competence in person.Competence)
                                    {
                                        if (competence.SubjectId == includedClass.Class.SubjectId)
                                        {
                                            if (competence.Qualified)
                                                qualifiedTeachers.Add(person);
                                            else
                                                unqualifiedTeachers.Add(person);

                                            match = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (!match)
                        {
                            classesWithoutCompetentTeachers.Add(includedClass);
                        }
                        else if (match)
                        {
                            if (qualifiedTeachers.Count() == 1)
                            {
                                qualifiedTeachers[0].IncludedClass.Add(includedClass);
                            }
                            else if (qualifiedTeachers.Count() > 1)
                            {
                                decimal personWithMostPointsLeft = 0;
                                Personnel personToAssign = new Personnel();
                                foreach (var teacher in qualifiedTeachers)
                                {
                                    if (((teacher.AvailablePoints * (maxNumber / 100.0m)) - teacher.AssignedPoints) > personWithMostPointsLeft)
                                    {
                                        personWithMostPointsLeft = ((teacher.AvailablePoints * (maxNumber / 100.0m)) - teacher.AssignedPoints);
                                        personToAssign = teacher;
                                    }
                                }
                                personToAssign.IncludedClass.Add(includedClass);
                            }
                            else
                            {
                                if (unqualifiedTeachers.Count() == 1)
                                {
                                    unqualifiedTeachers[0].IncludedClass.Add(includedClass);
                                }
                                else if (unqualifiedTeachers.Count() > 1)
                                {
                                    decimal personWithMostPointsLeft = 10000;
                                    Personnel personToAssign = new Personnel();
                                    foreach (var teacher in unqualifiedTeachers)
                                    {
                                        if (((teacher.AvailablePoints * (maxNumber / 100.0m)) - teacher.AssignedPoints) > personWithMostPointsLeft)
                                        {
                                            personWithMostPointsLeft = ((teacher.AvailablePoints * (maxNumber / 100.0m)) - teacher.AssignedPoints);
                                            personToAssign = teacher;
                                        }
                                    }
                                    personToAssign.IncludedClass.Add(includedClass);
                                }
                            }
                        }
                    }
                }
            }
            await SaveChangesAsync();
        }
    }
}
