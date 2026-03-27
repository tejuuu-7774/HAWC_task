<?php

namespace App\Models;
use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table = 'teachers';
    protected $allowedFields = ['user_id', 'university_name', 'gender', 'year_joined'];
}