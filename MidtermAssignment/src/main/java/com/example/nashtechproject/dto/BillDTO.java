package com.example.nashtechproject.dto;

import com.example.nashtechproject.entity.BillStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class BillDTO {
    private Long id;

    private float total;

    @JsonFormat(pattern="dd/MM/yyyy")
    private LocalDateTime createddate;

    @JsonFormat(pattern="dd/MM/yyyy")
    private LocalDateTime checkout_date;

    private String user_id;

    private String billStatus_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    public LocalDateTime getCreateddate() {
        return createddate;
    }

    public void setCreateddate(LocalDateTime createddate) {
        this.createddate = createddate;
    }

    public LocalDateTime getCheckout_date() {
        return checkout_date;
    }

    public void setCheckout_date(LocalDateTime checkout_date) {
        this.checkout_date = checkout_date;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getBillStatus_id() {
        return billStatus_id;
    }

    public void setBillStatus_id(String billStatus_id) {
        this.billStatus_id = billStatus_id;
    }
}
