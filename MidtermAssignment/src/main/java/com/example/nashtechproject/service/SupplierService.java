package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface SupplierService {
    public List<Supplier> retrieveSuppliers();

    public List<Supplier> getSupplierByStatus();

    public Supplier getSupplier(Long supplierId);

    public List<Supplier> getSuppliersPage(ProductPage productPage);

    public List<Supplier> getSupplierByName(String name);

    public List<Supplier> getSupplierByNamePage(String name, ProductPage productPage);

    public Supplier saveSupplier(Supplier supplier);

    public void deleteSupplier(Long supplierId);

    public void updateSupplier(Supplier supplier);

    public boolean existPhone(String phone);

    public boolean existName(String name);
}
