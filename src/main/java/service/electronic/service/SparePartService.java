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
        String category = (request.getCategory() != null && !request.getCategory().isBlank())
                ? request.getCategory().trim().toUpperCase()
                : "GEN";

        long count = sparePartRepository.countByCategoryIgnoreCase(category) + 1;
        String generatedPartCode = String.format("PRT-%s-%03d", category, count);

        String rawName = request.getPartName() != null ? request.getPartName().trim() : "";
        String formattedName = rawName.startsWith("[" + category + "]")
                ? rawName
                : String.format("[%s] %s", category, rawName);

        SparePart sparePart = SparePart.builder()
                .partCode(generatedPartCode)
                .partName(formattedName)
                .category(category)
                .stockQuantity(request.getStockQuantity())
                .purchasePrice(request.getPurchasePrice())
                .sellingPrice(request.getSellingPrice())
                .minStockWarning(request.getMinStockWarning() != null ? request.getMinStockWarning() : 5)
                .build();

        return mapToResponse(sparePartRepository.save(sparePart));
    }

    @Transactional
    public SparePartResponse updatePart(Long id, SparePartRequest request) {
        SparePart sparePart = sparePartRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sparepart tidak ditemukan"));

        String category = (request.getCategory() != null && !request.getCategory().isBlank())
                ? request.getCategory().trim().toUpperCase()
                : sparePart.getCategory();

        String rawName = request.getPartName() != null ? request.getPartName().trim() : "";
        String formattedName = rawName.startsWith("[" + category + "]")
                ? rawName
                : String.format("[%s] %s", category, rawName);

        sparePart.setPartName(formattedName);
        sparePart.setCategory(category);
        sparePart.setStockQuantity(request.getStockQuantity());
        sparePart.setPurchasePrice(request.getPurchasePrice());
        sparePart.setSellingPrice(request.getSellingPrice());

        if (request.getMinStockWarning() != null) {
            sparePart.setMinStockWarning(request.getMinStockWarning());
        }

        return mapToResponse(sparePartRepository.save(sparePart));
    }

    @Transactional
    public SparePartResponse updatePart(String id, SparePartRequest request) {
        return updatePart(Long.parseLong(id), request);
    }

    @Transactional
    public void deletePart(Long id) {
        if (!sparePartRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sparepart tidak ditemukan");
        }
        sparePartRepository.deleteById(id);
    }

    @Transactional
    public void deletePart(String id) {
        deletePart(Long.parseLong(id));
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
                .build();
    }
}