from django.shortcuts import render
from django.http import HttpResponse, FileResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .database.database import insert_new_file, get_file, get_dirid_from_parent, get_files_from_dir, get_subdirs_from_dir, create_new_dir, create_user, check_user_exists
from .database.security.security import encrypt_password

''' Class for File table in database '''
class FileView(APIView):
    ''' 
        request:
            name - string representing requested file name
        Returns:
            Response containing binary data of specified file
    '''
    def get(self, request):
        file_name = request.query_params.get('name')
        binary_data = get_file(file_name)
        return HttpResponse(binary_data, headers={'Content-Disposition': 'attachment; filename=' + file_name})

    '''
        request:
            file_name - file's name
            parent_path - path of parent directory
        Returns:
            Response indicating whether a new file entry was successfully added
    ''' 
    def post(self, request):
        parent_path = request.query_params.get('parent_path')
        file_name = request.query_params.get('name')
        user_id = request.query_params.get('user_id')
        file = request.FILES['file']
        binary_data = file.read()
        valid_operation = insert_new_file(binary_data, file_name, parent_path, user_id)
        # If false is returned from insert_new_file, that means the parent_path doesn't exist
        if not valid_operation:
            return Response({"status":"failure"},status=status.HTTP_404_NOT_FOUND)
        return Response({"status":"success"},status=status.HTTP_200_OK)

# Class for
class DirView(APIView):
    '''
        request:
            dir_path - string representing directory
        Response:
            dirs - sub directories of the given directory
            files - sub files of the given directory
    '''
    def get(self, request):
        dir_path = request.query_params.get('dir_path')
        user_id = request.query_params.get('user_id')
        dir_id = get_dirid_from_parent(dir_path, user_id)
        files_list = get_files_from_dir(dir_path, dir_id)
        # If the given files don't exist, then the dir_path doesn't exist
        if files_list == -1:
            return Response({"status":"failure"},status=status.HTTP_404_NOT_FOUND)
        dir_list = get_subdirs_from_dir(dir_path, user_id, dir_id)
        return Response({"files":files_list, "subdirs":dir_list})

    '''
        request:
            dir_name - string representing directory being created
            dir_path - string representing directory path
            parent_path - string representing the path to the parent directory
    '''
    def post(self, request):
        parent_path = request.query_params.get('parent_path')
        user_id = request.query_params.get('user_id')
        is_home_path = request.query_params.get('is_home_path')
        parent_id = create_new_dir(None, "C:", "C:", user_id) if is_home_path == "1" else get_dirid_from_parent(parent_path, user_id)
        print("Parent id: ", parent_id)
        if parent_id == -1:
            return Response({"status":"failure"},status=status.HTTP_404_NOT_FOUND)
        dir_name = request.query_params.get('dir_name')
        dir_path = request.query_params.get('dir_path')
        create_new_dir(parent_id, dir_name, dir_path, user_id)
        return Response({"status":"success"},status=status.HTTP_200_OK)

class UserView(APIView):
    '''
        Assumes user does not already exists
    '''
    def post(self, request):
        email = request.query_params.get('email')
        password = encrypt_password(request.query_params.get('password'))
        user_id = create_user(email, password)
        return Response({"id":user_id},status=status.HTTP_200_OK)
    
    def get(self, request):
        email = request.query_params.get('email')
        password = request.query_params.get('password')
        user_pass_exists, user_exists, user_id = check_user_exists(email, password)
        return Response({"user_pass_exists":user_pass_exists, "user_exists":user_exists, "id":user_id},status=status.HTTP_200_OK)