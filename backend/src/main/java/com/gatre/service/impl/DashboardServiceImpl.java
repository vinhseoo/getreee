package com.gatre.service.impl;

import com.gatre.dto.response.DashboardStatsDTO;
import com.gatre.entity.enums.ProductStatus;
import com.gatre.repository.ChatMessageRepository;
import com.gatre.repository.ConversationRepository;
import com.gatre.repository.ProductRepository;
import com.gatre.repository.UserRepository;
import com.gatre.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository      productRepository;
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository  chatMessageRepository;
    private final UserRepository         userRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getStats() {
        return new DashboardStatsDTO(
                productRepository.count(),
                productRepository.countByStatus(ProductStatus.AVAILABLE),
                conversationRepository.count(),
                chatMessageRepository.countByReadFalse(),
                userRepository.count()
        );
    }
}
