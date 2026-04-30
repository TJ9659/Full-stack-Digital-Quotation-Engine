package com.LMS.quotation.model;

import com.LMS.quotation.enums.GenderType;
import com.LMS.quotation.enums.OccupationType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quotations")
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String prospectName;
    private int age;

    private GenderType gender;
    private OccupationType occupation; // Class 1, 2, or 3
    private BigDecimal sumAssured; // the coverage amount requested by client

    private boolean isSmoker;

    private BigDecimal basePremium;   // RM 100.00
    private BigDecimal loadingAmount; // age + occupation extra charges
    private BigDecimal taxAmount;    // 6% SST
    private BigDecimal totalPremium;  // final price to be paid

    private LocalDateTime createdAt;
    private String status;
    private Long batchJobId;
}
