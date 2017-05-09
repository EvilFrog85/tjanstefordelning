﻿using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class Class
    {
        public int Id { get; set; }
        public string ClassName { get; set; }
        public string ClassCode { get; set; }
        public int Points { get; set; }
        public int SubjectId { get; set; }

        public virtual Subject Subject { get; set; }
    }
}
