package service.electronic.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.electronic.dto.SparePartRequest;
import service.electronic.dto.SparePartResponse;
import service.electronic.service.SparePartService;

import java.util.List;

@RestController
// Mendukung pemanggilan dari /api/spareparts maupun /api/v1/spare-parts
@RequestMapping({"/api/v1/spare-parts", "/api/spareparts"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SparePartController {

    private final SparePartService sparePartService;

    @GetMapping
    public ResponseEntity<List<SparePartResponse>> getAllParts() {
        return ResponseEntity.ok(sparePartService.getAllParts());
    }

    @PostMapping
    public ResponseEntity<SparePartResponse> createPart(@RequestBody SparePartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sparePartService.createPart(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SparePartResponse> updatePart(@PathVariable String id, @RequestBody SparePartRequest request) {
        return ResponseEntity.ok(sparePartService.updatePart(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePart(@PathVariable String id) {
        sparePartService.deletePart(id);
        return ResponseEntity.noContent().build();
    }
}