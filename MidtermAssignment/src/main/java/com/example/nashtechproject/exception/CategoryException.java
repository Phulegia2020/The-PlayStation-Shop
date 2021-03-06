package com.example.nashtechproject.exception;

public class CategoryException extends RuntimeException{
    public CategoryException(Long id)
    {
        super("Could not find category with id = " + id);
    }

    public CategoryException(String name)
    {
        super(name + " is existed!");
    }
}
