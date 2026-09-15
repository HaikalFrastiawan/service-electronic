package service.electronic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import service.electronic.entity.ElectronicDevice;

import java.util.List;

@Repository
public interface ElectronicDeviceRepository extends JpaRepository<ElectronicDevice, String> {
    List<ElectronicDevice> findByOwnerId(String ownerId);

}
