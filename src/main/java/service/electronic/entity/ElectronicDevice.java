package service.electronic.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "electronic_devices")
public class ElectronicDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeviceCategory category;
    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String modelName;

    private String serialNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String issueDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}
