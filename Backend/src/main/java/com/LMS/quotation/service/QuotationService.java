package com.LMS.quotation.service;

import com.LMS.quotation.dto.QuotationListResponse;
import com.LMS.quotation.dto.QuotationRequest;
import com.LMS.quotation.dto.QuotationResponse;
import com.LMS.quotation.enums.OccupationType;
import com.LMS.quotation.model.Quotation;
import com.LMS.quotation.repository.QuotationRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuotationService {

    private final QuotationRepository quotationRepository;

    public QuotationService(QuotationRepository quotationRepository) {
        this.quotationRepository = quotationRepository;
    }

    public QuotationResponse calculatePremium(QuotationRequest request) {

        Quotation quotation = new Quotation();

        quotation.setBatchJobId(null);
        quotation.setProspectName(request.getProspectName());
        quotation.setAge(request.getAge());
        quotation.setGender(request.getGender());
        quotation.setOccupation(request.getOccupation());
        quotation.setSumAssured(request.getSumAssured());
        quotation.setSmoker(request.isSmoker());
        BigDecimal coverageAmount = request.getSumAssured();

        BigDecimal ratePer1000;

        ratePer1000 = switch (request.getGender()) {
            case M -> new BigDecimal("2.50");
            case F -> new BigDecimal("2.00");
            default -> new BigDecimal("2.25");
        };

        BigDecimal ratePerUnit = new BigDecimal("1000.00");

        BigDecimal basePremium = coverageAmount.divide(ratePerUnit, 4, RoundingMode.HALF_UP).multiply(ratePer1000);

        BigDecimal runningTotal = basePremium;

        if(request.isSmoker()){
            runningTotal = runningTotal.multiply(new BigDecimal("1.25"));
        }

        if (request.getAge() > 25) {
            BigDecimal yearsAbove = new BigDecimal(request.getAge() - 25);
            BigDecimal ageLoading = yearsAbove.multiply(new BigDecimal("2.00"));
            runningTotal = runningTotal.add(ageLoading);
        }

        BigDecimal occPercentage = getOccupationRate(request.getOccupation());
        BigDecimal occLoadingAmount = runningTotal.multiply(occPercentage);

        BigDecimal preTaxTotal = runningTotal.add(occLoadingAmount);

        BigDecimal taxAmount = preTaxTotal.multiply(new BigDecimal("0.06"));
        BigDecimal totalPremium = preTaxTotal.add(taxAmount);

        quotation.setBasePremium(basePremium);
        quotation.setLoadingAmount(preTaxTotal);
        quotation.setTaxAmount(taxAmount);
        quotation.setTotalPremium(totalPremium);
        quotation.setCreatedAt(LocalDateTime.now());
        quotation.setStatus("COMPLETED");

        Quotation savedQuotation = quotationRepository.save(quotation);

        BigDecimal base = basePremium;

        return QuotationResponse.builder()
                .prospectName(savedQuotation.getProspectName())
                .age(savedQuotation.getAge())
                .gender(savedQuotation.getGender())
                .basePremium(base.setScale(2, RoundingMode.HALF_UP))
                .loadingAmount(preTaxTotal.subtract(basePremium).setScale(2, RoundingMode.HALF_UP))
                .taxAmount(savedQuotation.getTaxAmount().setScale(2, RoundingMode.HALF_UP))
                .totalPremium(savedQuotation.getTotalPremium().setScale(2, RoundingMode.HALF_UP))
                .build();
    }

    public List<QuotationResponse> processBulk(MultipartFile file) throws Exception {
        List<QuotationResponse> responses = new ArrayList<>();

        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            HeaderColumnNameMappingStrategy<QuotationRequest> strategy = new HeaderColumnNameMappingStrategy<>();
            strategy.setType(QuotationRequest.class);

            CsvToBean<QuotationRequest> csvToBean = new CsvToBeanBuilder<QuotationRequest>(reader)
                    .withMappingStrategy(strategy)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();

            List<QuotationRequest> requests = csvToBean.parse();

            for (QuotationRequest request : requests) {
                responses.add(calculatePremium(request));
            }
        }
        return responses;
    }

    private BigDecimal getOccupationRate(OccupationType occClass) {
        return switch (occClass) {
            case CLASS_2 -> new BigDecimal("0.10");
            case CLASS_3  -> new BigDecimal("0.25");
            default -> BigDecimal.ZERO;
        };
    }

    public QuotationListResponse getLastTenQuotes(){
        List<Quotation> entities = quotationRepository.findTop10ByOrderByCreatedAtDesc();

        List<QuotationResponse> responseList = entities.stream()
                .map(entity -> QuotationResponse.builder()
                        .prospectName(entity.getProspectName())
                        .totalPremium(entity.getTotalPremium())
                        .taxAmount(entity.getTaxAmount())
                        .loadingAmount(entity.getLoadingAmount())
                        .basePremium(entity.getBasePremium())
                        .status(entity.getStatus())
                        .createdAt(entity.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")))
                        .build())
                .toList();

        return new QuotationListResponse(responseList, responseList.size());
    }

    public QuotationListResponse getPagedQuotes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Quotation> quotePage = quotationRepository.findAllByOrderByCreatedAtDesc(pageable);

        List<QuotationResponse> quotations = quotePage.getContent().stream()
                 .map(entity -> QuotationResponse.builder()
                .prospectName(entity.getProspectName())
                         .gender(entity.getGender())
                         .age(entity.getAge())
                         .isSmoker(entity.isSmoker())
                         .occupation(entity.getOccupation())
                .totalPremium(entity.getTotalPremium())
                .taxAmount(entity.getTaxAmount())
                .loadingAmount(entity.getLoadingAmount())
                .basePremium(entity.getBasePremium())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")))
                .build())
                .toList();


        return QuotationListResponse.builder()
                .quotations(quotations)
                .currentPage(quotePage.getNumber())
                .totalPages(quotePage.getTotalPages())
                .totalElements(quotePage.getTotalElements())
                .pageSize(quotePage.getSize())
                .build();
    }

}
