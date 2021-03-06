package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.exception.SupplierException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("api/suppliers")
public class SupplierController {
    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public List<Supplier> getAllSupplier()
    {
        List<Supplier> suppliers = supplierService.getSupplierByStatus();
        return suppliers.stream().sorted(Comparator.comparingLong(Supplier::getId)).collect(Collectors.toList());
    }

    @GetMapping("/{supplierId}")
    public Supplier findSupplier(@PathVariable Long supplierId)
    {
        Supplier sup = supplierService.getSupplier(supplierId);
        if (sup == null)
        {
            throw new SupplierException(supplierId);
        }
        return supplierService.getSupplier(supplierId);
    }
    @GetMapping("/page")
    public ResponseEntity<List<Supplier>> getSuppliersPages(ProductPage productPage)
    {
        return new ResponseEntity<>(supplierService.getSuppliersPage(productPage), HttpStatus.OK);
    }

    @GetMapping("/name")
    public int getSupplierByName(@RequestParam String name)
    {
        List<Supplier> suppliers = supplierService.getSupplierByName(name);
        return suppliers.size();
    }

    @GetMapping("/namePage")
    public ResponseEntity<List<Supplier>> getSupplierByNamePage(ProductPage productPage, @RequestParam String name)
    {
        return new ResponseEntity<>(supplierService.getSupplierByNamePage(name, productPage), HttpStatus.OK);
    }

    @PostMapping
    public Supplier saveSupplier(@RequestBody Supplier supplier)
    {
        if (supplierService.existName(supplier.getName()))
        {
            throw new SupplierException(supplier.getName());
        }
        if (supplierService.existPhone(supplier.getPhone()))
        {
            throw new SupplierException(supplier.getPhone());
        }
        supplier.setStatus(STATE.ACTIVE);
        return supplierService.saveSupplier(supplier);
    }

    @PutMapping("/{supplierId}")
    public Supplier updateSupplier(@PathVariable(name = "supplierId") Long supplierId, @Valid @RequestBody Supplier supplierDetails)
    {
        Supplier supplier = supplierService.getSupplier(supplierId);
        if (supplier == null)
        {
            throw new SupplierException(supplierId);
        }
        else
        {
            supplier.setName(supplierDetails.getName());
            supplier.setAddress(supplierDetails.getAddress());
            supplier.setPhone(supplierDetails.getPhone());
            supplierService.updateSupplier(supplier);
        }
        return supplier;
    }

    @DeleteMapping("/{supplierId}")
    public ResponseEntity<?> deleteSupplier(@PathVariable(name = "supplierId") Long supplierId)
    {
        Supplier supplier = supplierService.getSupplier(supplierId);
        if (supplier == null)
        {
            throw new SupplierException(supplierId);
        }
        supplier.setStatus(STATE.INACTIVE);
        supplierService.updateSupplier(supplier);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }
}
