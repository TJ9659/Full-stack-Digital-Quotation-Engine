package com.LMS.quotation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class QuotationListResponse {
    private List<QuotationResponse> quotations;
    private int count;
    private int currentPage;
    private long totalElements;
    private int totalPages;
    private int pageSize;

    public QuotationListResponse(List<QuotationResponse> quotations, int count) {
        this.quotations = quotations;
        this.count = count;
    }
}
