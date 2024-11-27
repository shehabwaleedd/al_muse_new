import "./skeleton.scss";
export default function Skeleton() {
    return (
        <div className="products-grid">
            {
                [...new Array(10)].map((p, index) => (
                    <article key={index} className="skeleton-card">
                        <div className="skeleton skeleton-card-img">
                        </div>
                        <div className="skeleton-card-text">
                            <h2 className="skeleton skeleton-card-title"></h2>
                            <h4 className="skeleton skeleton-card-brand"></h4>
                            <div>
                                <p className="skeleton skeleton-card-description"></p>
                                <p className="skeleton skeleton-card-description"></p>
                                <p className="skeleton skeleton-card-description"></p>
                            </div>
                        </div>
                    </article>
                ))
            }
        </div>
    )
}