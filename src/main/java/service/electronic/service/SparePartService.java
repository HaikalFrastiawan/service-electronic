package service.electronic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import service.electronic.dto.SparePartRequest;
import service.electronic.dto.SparePartResponse;
import service.electronic.entity.SparePart;
import service.electronic.repository.SparePartRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SparePartService {

    private final SparePartRepository sparePartRepository;

    @Transactional(readOnly = true)
    public List<SparePartResponse> getAllParts() {
        return sparePartRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SparePartResponse createPart(SparePartRequest request) {
        SparePart sparePart = SparePart.builder()
                .partCode(request.getPartCode())
                .partName(request.getPartName())
                .category(request.getCategory())
                .stockQuantity(request.getStockQuantity())
                .purchasePrice(request.getPurchasePrice())
                .sellingPrice(request.getSellingPrice())
                .minStockWarning(request.getMinStockWarning() != null ? request.getMinStockWarning() : 5)
                .build();

        return mapToResponse(sparePartRepository.save(sparePart));
    }

    @Transactional
    public SparePartResponse updatePart(String id, SparePartRequest request) {
        SparePart sparePart = sparePartRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sparepart tidak ditemukan"));

        sparePart.setPartName(request.getPartName());
        sparePart.setCategory(request.getCategory());
        sparePart.setStockQuantity(request.getStockQuantity());
        sparePart.setPurchasePrice(request.getPurchasePrice());
        sparePart.setSellingPrice(request.getSellingPrice());

        if (request.getMinStockWarning() != null) {
            sparePart.setMinStockWarning(request.getMinStockWarning());
        }

        return mapToResponse(sparePartRepository.save(sparePart));
    }

    @Transactional
    public void deletePart(String id) {
        if (!sparePartRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sparepart tidak ditemukan");
        }
        sparePartRepository.deleteById(id);
    }

    private SparePartResponse mapToResponse(SparePart part) {
        return SparePartResponse.builder()
                .id(part.getId())
                .partCode(part.getPartCode())
                .partName(part.getPartName())
                .category(part.getCategory())
                .stockQuantity(part.getStockQuantity())
                .purchasePrice(part.getPurchasePrice())
                .sellingPrice(part.getSellingPrice())
                .minStockWarning(part.getMinStockWarning())
                .isLowStock(part.getStockQuantity() <= part.getMinStockWarning())
                .build();
    }
}