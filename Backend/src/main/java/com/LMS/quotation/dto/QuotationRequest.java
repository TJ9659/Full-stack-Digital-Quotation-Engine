package com.LMS.quotation.dto;
import com.LMS.quotation.enums.GenderType;
import com.LMS.quotation.enums.OccupationType;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.opencsv.bean.CsvBindByName;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;

@Data
public class QuotationRequest {
    @CsvBindByName(column = "prospectName")
    private String prospectName;

    @Enumerated(EnumType.STRING)
    @CsvBindByName(column = "gender")
    private GenderType gender;

    @CsvBindByName(column = "age")
    private int age;


    @JsonProperty("isSmoker")
    @CsvBindByName(column = "isSmoker")
    private boolean isSmoker;

    @Enumerated(EnumType.STRING)
    @CsvBindByName(column = "occupation")
    private OccupationType occupation;

    @CsvBindByName(column = "sumAssured")
    private BigDecimal sumAssured;
}
