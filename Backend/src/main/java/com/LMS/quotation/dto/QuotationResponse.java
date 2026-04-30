package com.LMS.quotation.dto;

import com.LMS.quotation.enums.GenderType;
import com.LMS.quotation.enums.OccupationType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotationResponse {
    private String prospectName;
    private GenderType gender;
    private OccupationType occupation;
    private int age;

    @JsonProperty("isSmoker")
    private boolean isSmoker;
    private BigDecimal basePremium;
    private BigDecimal loadingAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalPremium;
    private String status;
    private String createdAt;
}
