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
        private async Task UpdatePerson(Personnel person, IncludedClass classs)
        {
            person.AssignedPoints += classs.Class.Points;
            classs.Assigned = true;
            await SaveChangesAsync();
        }
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
            

            List<IncludedClass> classesWithoutCompetentTeachersInTeam = new List<IncludedClass>();
            foreach (var team in arrayWithTeams)
            {
                if (team.IncludedClass != null)
                {
                    foreach (var includedClass in team.IncludedClass.Where(t => t.Assigned == false))
                    {
                        List<Personnel> qualifiedTeachers = new List<Personnel>();
                        List<Personnel> unqualifiedTeachers = new List<Personnel>();
                        bool match = false;
                        foreach (var person in team.Personnel)
                        {
                            decimal pointsLeft = ((person.AvailablePoints * (maxNumber / 100.0m))) - person.AssignedPoints;
                            
                            if (pointsLeft >= includedClass.Class.Points)
                            {
                                if (person.Competence != null && person.Competence.Count() > 0)
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
                            classesWithoutCompetentTeachersInTeam.Add(includedClass);
                        }
                        else if (match)
                        {
                            if (qualifiedTeachers.Count() == 1)
                            {
                                qualifiedTeachers[0].IncludedClass.Add(includedClass);
                                await UpdatePerson(qualifiedTeachers[0], includedClass);
                            }
                            else if (qualifiedTeachers.Count() > 1)
                            {
                                decimal personWithMostPointsLeft = 0;
                                Personnel personToAssign = new Personnel();
                                foreach (var teacher in qualifiedTeachers)
                                {
                                    var pointsLeft = ((teacher.AvailablePoints * (maxNumber / 100.0m)) - teacher.AssignedPoints);
                                    if ( pointsLeft > personWithMostPointsLeft)
                                    {
                                        personWithMostPointsLeft = pointsLeft;
                                        personToAssign = teacher;
                                    }
                                }
                                personToAssign.IncludedClass.Add(includedClass);
                                await UpdatePerson(personToAssign, includedClass);
                            }
                            else
                            {
                                if (unqualifiedTeachers.Count() == 1)
                                {
                                    unqualifiedTeachers[0].IncludedClass.Add(includedClass);
                                    await UpdatePerson(unqualifiedTeachers[0], includedClass);
                                }
                                else if (unqualifiedTeachers.Count() > 1)
                                {
                                    decimal personWithMostPointsLeft = 0;
                                    Personnel personToAssign = new Personnel();
                                    foreach (var teacher in unqualifiedTeachers)
                                    {
                                        var pointsLeft = ((teacher.AvailablePoints * (maxNumber / 100.0m)) - teacher.AssignedPoints);
                                        if (pointsLeft > personWithMostPointsLeft)
                                        {
                                            personWithMostPointsLeft = pointsLeft;
                                            personToAssign = teacher;
                                        }
                                    }
                                    personToAssign.IncludedClass.Add(includedClass);
                                    await UpdatePerson(personToAssign, includedClass);
                                }
                            }
                        }
                    }
                }
            }

            foreach (var includedClass in classesWithoutCompetentTeachersInTeam)
            {
                List<Personnel> qualifiedTeachers = new List<Personnel>();
                List<Personnel> unqualifiedTeachers = new List<Personnel>();
                bool match = false;
                foreach (var team in Team.Where(t => t.Id != includedClass.TeamId))
                {
                    foreach (var person in team.Personnel)
                    {
                        var pointsLeft = ((person.AvailablePoints * (maxNumber / 100.0m)) - person.AssignedPoints);
                        if ( pointsLeft >= includedClass.Class.Points)
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
                }
                if (match)
                {
                    if (qualifiedTeachers.Count() == 1)
                    {
                        qualifiedTeachers[0].IncludedClass.Add(includedClass);
                        await UpdatePerson(qualifiedTeachers[0], includedClass);
                    }
                    else if (qualifiedTeachers.Count() > 1)
                    {
                        decimal personWithMostPointsLeft = 0;
                        Personnel personToAssign = new Personnel();
                        foreach (var teacher in qualifiedTeachers)
                        {
                            var pointsLeft = ((teacher.AvailablePoints * (maxNumber / 100.0m)) - teacher.AssignedPoints);
                            if (pointsLeft > personWithMostPointsLeft)
                            {
                                personWithMostPointsLeft = pointsLeft;
                                personToAssign = teacher;
                            }
                        }
                        personToAssign.IncludedClass.Add(includedClass);
                        await UpdatePerson(personToAssign, includedClass);
                    }
                    else
                    {
                        if (unqualifiedTeachers.Count() == 1)
                        {
                            unqualifiedTeachers[0].IncludedClass.Add(includedClass);
                            await UpdatePerson(unqualifiedTeachers[0], includedClass);
                            
                        }
                        else if (unqualifiedTeachers.Count() > 1)
                        {
                            decimal personWithMostPointsLeft = 0;
                            Personnel personToAssign = new Personnel();
                            foreach (var teacher in unqualifiedTeachers)
                            {
                                var pointsLeft = ((teacher.AvailablePoints * (maxNumber / 100.0m)) - teacher.AssignedPoints);
                                if (pointsLeft > personWithMostPointsLeft)
                                {
                                    personWithMostPointsLeft = pointsLeft;
                                    personToAssign = teacher;
                                }
                            }
                            personToAssign.IncludedClass.Add(includedClass);
                            await UpdatePerson(personToAssign, includedClass);
                        }
                    }
                }
            }
            await SaveChangesAsync();
        }
    }
}
