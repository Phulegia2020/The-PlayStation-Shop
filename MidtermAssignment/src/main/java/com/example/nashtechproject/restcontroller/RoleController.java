package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Role;
import com.example.nashtechproject.exception.RoleException;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("api/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @GetMapping
    public List<Role> getAllRoles()
    {
        List<Role> roles = roleService.retrieveRoles();
        return roles;
    }

    @GetMapping("/{roleId}")
    public Role findRole(@PathVariable Long roleId)
    {
        Role ro = roleService.getRole(roleId);
        if (ro == null)
        {
            throw new RoleException(roleId);
        }
        return roleService.getRole(roleId);
    }

    @PostMapping
    public Role saveRole(@RequestBody Role role)
    {
        return roleService.saveRole(role);
    }

    @PutMapping("/{roleId}")
    public Role updateRole(@PathVariable(name = "roleId") Long roleId, @Validated @RequestBody Role roleDetails)
    {
        Role role = roleService.getRole(roleId);
        if (role == null)
        {
            throw new RoleException(roleId);
        }
        else
        {
            role.setName(roleDetails.getName());
            roleService.updateRole(role);
        }
        return role;
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<?> deleteRole(@PathVariable(name = "roleId") Long roleId)
    {
        Role role = roleService.getRole(roleId);
        if (role == null)
        {
            throw new RoleException(roleId);
        }
        roleService.deleteRole(roleId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }
}
