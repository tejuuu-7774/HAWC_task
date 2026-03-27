<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\TeacherModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class AuthController extends BaseController
{
    private $key = "teju_super_secure_jwt_secret_key_2026_very_long";

    // Register API
    public function register()
    {
        $userModel = new UserModel();
        $teacherModel = new TeacherModel();

        $data = $this->request->getJSON(true);

        // Insert into auth_user
        $userId = $userModel->insert([
            'email' => $data['email'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT)
        ]);

        // Insert into teachers
        $teacherModel->insert([
            'user_id' => $userId,
            'university_name' => $data['university_name'],
            'gender' => $data['gender'],
            'year_joined' => $data['year_joined']
        ]);

        return $this->response->setJSON([
            'message' => 'User registered successfully'
        ]);
    }

    // LOGIN API WITH JWT
    public function login()
    {
        $userModel = new UserModel();
        $data = $this->request->getJSON(true);

        $user = $userModel->where('email', $data['email'])->first();

        if (!$user) {
            return $this->response->setJSON([
                'message' => 'User not found '
            ]);
        }

        if (!password_verify($data['password'], $user['password'])) {
            return $this->response->setJSON([
                'message' => 'Wrong password'
            ]);
        }

        $payload = [
            'iat' => time(),
            'exp' => time() + 3600, // 1 hour expiry
            'data' => [
                'user_id' => $user['id'],
                'email' => $user['email']
            ]
        ];

        try {
            $token = JWT::encode($payload, $this->key, 'HS256');
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'error' => $e->getMessage()
            ]);
        }

        // REMOVES PASSWORD BEFORE RESPONSE
        unset($user['password']);

        return $this->response->setJSON([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function getUsers()
    {
        $userModel = new \App\Models\UserModel();
        return $this->response->setJSON($userModel->findAll());
    }

    public function getTeachers()
    {
        $teacherModel = new \App\Models\TeacherModel();
        return $this->response->setJSON($teacherModel->findAll());
    }
}