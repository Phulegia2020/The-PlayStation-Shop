package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.service.BillStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/billstatuses")
public class BillStatusController {
    @Autowired
    private BillStatusService billStatusService;

    @GetMapping
    public List<BillStatus> getAllBillStatuses()
    {
        List<BillStatus> bs = billStatusService.retrieveBillStatuses();
        return bs;
    }

    @GetMapping("/{billStatusId}")
    public BillStatus findBillStatus(@PathVariable Long billStatusId)
    {
        BillStatus bs = billStatusService.getBillStatus(billStatusId);
        if (bs == null)
        {
            throw new BillStatusException(billStatusId);
        }
        return billStatusService.getBillStatus(billStatusId);
    }

    @PostMapping
    public BillStatus saveBillStatus(@RequestBody BillStatus billStatus)
    {
//        List<BillStatus> categories = BillStatusService.retrieveCategories();
//        for (BillStatus emp:categories) {
//            if (BillStatus.getName().equals(emp.getName()))
//            {
//                throw new BillStatusException(BillStatus.getName());
//            }
//        }
        return billStatusService.saveBillStatus(billStatus);
    }

    @PutMapping("/{billStatusId}")
    public BillStatus updateBillStatus(@PathVariable(name = "billStatusId") Long billStatusId, @Valid @RequestBody BillStatus billStatusDetails)
    {
        BillStatus billStatus = billStatusService.getBillStatus(billStatusId);
        if (billStatus == null)
        {
            throw new BillStatusException(billStatusId);
        }
        else
        {
            billStatus.setDescription(billStatusDetails.getDescription());
            billStatusService.updateBillStatus(billStatus);
        }
        return billStatus;
    }

    @DeleteMapping("/{billStatusId}")
    public HashMap<String, String> deleteBillStatus(@PathVariable(name = "billStatusId") Long billStatusId)
    {
        BillStatus billStatus = billStatusService.getBillStatus(billStatusId);
        if (billStatus == null)
        {
            throw new BillStatusException(billStatusId);
        }
        billStatusService.deleteBillStatus(billStatusId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
        return map;
    }
}