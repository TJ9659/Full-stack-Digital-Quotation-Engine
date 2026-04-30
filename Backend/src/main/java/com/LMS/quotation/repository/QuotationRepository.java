package com.LMS.quotation.repository;

import com.LMS.quotation.model.Quotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long>, PagingAndSortingRepository<Quotation, Long> {

    List<Quotation> findTop10ByOrderByCreatedAtDesc();

    Page<Quotation> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
