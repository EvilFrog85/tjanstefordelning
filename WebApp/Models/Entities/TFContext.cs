using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WebApp.Models.Entities
{
    public partial class TFContext : DbContext
    {
        public virtual DbSet<AuxiliaryAssignment> AuxiliaryAssignment { get; set; }
        public virtual DbSet<Class> Class { get; set; }
        public virtual DbSet<Competence> Competence { get; set; }
        public virtual DbSet<IncludedClass> IncludedClass { get; set; }
        public virtual DbSet<Personnel> Personnel { get; set; }
        public virtual DbSet<StudentGroup> StudentGroup { get; set; }
        public virtual DbSet<Subject> Subject { get; set; }
        public virtual DbSet<Team> Team { get; set; }
        public virtual DbSet<User> User { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AuxiliaryAssignment>(entity =>
            {
                entity.ToTable("Auxiliary_assignment", "TF");

                entity.Property(e => e.Assigned).HasDefaultValueSql("0");

                entity.Property(e => e.Description).HasColumnType("text");

                entity.Property(e => e.Mandatory).HasDefaultValueSql("0");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.PersonnelId).HasColumnName("Personnel_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.Personnel)
                    .WithMany(p => p.AuxiliaryAssignment)
                    .HasForeignKey(d => d.PersonnelId)
                    .HasConstraintName("FK_Auxiliary_assignment_ToPersonnel");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AuxiliaryAssignment)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Auxiliary_assignment_ToUser");
            });

            modelBuilder.Entity<Class>(entity =>
            {
                entity.ToTable("Class", "TF");

                entity.Property(e => e.ClassCode)
                    .IsRequired()
                    .HasColumnName("Class_code")
                    .HasMaxLength(12);

                entity.Property(e => e.ClassName)
                    .IsRequired()
                    .HasColumnName("Class_name")
                    .HasMaxLength(60);

                entity.Property(e => e.SubjectId).HasColumnName("Subject_Id");

                entity.HasOne(d => d.Subject)
                    .WithMany(p => p.Class)
                    .HasForeignKey(d => d.SubjectId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Class_ToSubject");
            });

            modelBuilder.Entity<Competence>(entity =>
            {
                entity.ToTable("Competence", "TF");

                entity.Property(e => e.PersonnelId).HasColumnName("Personnel_Id");

                entity.Property(e => e.Qualified).HasDefaultValueSql("0");

                entity.Property(e => e.SubjectId).HasColumnName("Subject_Id");

                entity.HasOne(d => d.Personnel)
                    .WithMany(p => p.Competence)
                    .HasForeignKey(d => d.PersonnelId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Competence_ToPersonnel");

                entity.HasOne(d => d.Subject)
                    .WithMany(p => p.Competence)
                    .HasForeignKey(d => d.SubjectId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Competence_ToSubject");
            });

            modelBuilder.Entity<IncludedClass>(entity =>
            {
                entity.ToTable("Included_class", "TF");

                entity.Property(e => e.Assigned).HasDefaultValueSql("0");

                entity.Property(e => e.ClassId).HasColumnName("Class_Id");

                entity.Property(e => e.PersonnelId).HasColumnName("Personnel_Id");

                entity.Property(e => e.StudentGroupId).HasColumnName("Student_group_Id");

                entity.Property(e => e.TeamId).HasColumnName("Team_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.Personnel)
                    .WithMany(p => p.IncludedClass)
                    .HasForeignKey(d => d.PersonnelId)
                    .HasConstraintName("FK_Included_class_ToPersonnel");

                entity.HasOne(d => d.StudentGroup)
                    .WithMany(p => p.IncludedClass)
                    .HasForeignKey(d => d.StudentGroupId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Included_class_ToStudent_group");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.IncludedClass)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Included_class_ToTeam");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.IncludedClass)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Included_class_ToUser");
            });

            modelBuilder.Entity<Personnel>(entity =>
            {
                entity.ToTable("Personnel", "TF");

                entity.Property(e => e.AssignedPoints)
                    .HasColumnName("Assigned_Points")
                    .HasColumnType("decimal")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.AvailablePoints)
                    .HasColumnName("Available_Points")
                    .HasColumnType("decimal");

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ImageUrl)
                    .HasColumnName("Image_url")
                    .HasColumnType("varchar(100)");

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Signature)
                    .IsRequired()
                    .HasColumnType("varchar(3)");

                entity.Property(e => e.TeamId).HasColumnName("Team_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.Personnel)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Personnel_ToTeam");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Personnel)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Personnel_ToUser");
            });

            modelBuilder.Entity<StudentGroup>(entity =>
            {
                entity.ToTable("Student_group", "TF");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.StartingYear).HasColumnName("Starting_year");

                entity.Property(e => e.TeamId).HasColumnName("Team_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.StudentGroup)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Student_group_ToTeam");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.StudentGroup)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Student_group_ToUser");
            });

            modelBuilder.Entity<Subject>(entity =>
            {
                entity.ToTable("Subject", "TF");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(60);

                entity.Property(e => e.SubjectCode)
                    .IsRequired()
                    .HasColumnName("Subject_code")
                    .HasColumnType("varchar(3)");
            });

            modelBuilder.Entity<Team>(entity =>
            {
                entity.ToTable("Team", "TF");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Team)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Team_ToUser");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User", "TF");

                entity.Property(e => e.SchoolId)
                    .IsRequired()
                    .HasColumnName("School_Id")
                    .HasMaxLength(450);

                entity.Property(e => e.SchoolName)
                    .IsRequired()
                    .HasMaxLength(30);
            });
        }
    }
}