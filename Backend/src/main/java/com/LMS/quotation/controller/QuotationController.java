package com.LMS.quotation.controller;

import com.LMS.quotation.dto.QuotationListResponse;
import com.LMS.quotation.dto.QuotationRequest;
import com.LMS.quotation.dto.QuotationResponse;
import com.LMS.quotation.service.QuotationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {
    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<QuotationResponse> calculate(@RequestBody QuotationRequest request) {
        return ResponseEntity.ok(quotationService.calculatePremium(request));
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<List<QuotationResponse>> bulkUpload(@RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(quotationService.processBulk(file));
    }

    @GetMapping("/recent-quotes")
    public ResponseEntity<QuotationListResponse> recentCalculations() {
        return ResponseEntity.ok(quotationService.getLastTenQuotes());
    }

    @GetMapping("/history")
    public ResponseEntity<QuotationListResponse> getQuotationHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(quotationService.getPagedQuotes(page, size));
    }

}
