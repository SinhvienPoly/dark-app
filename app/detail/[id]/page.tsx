type ParamsProps = {
    params: {
        id: string;
    };
};

const VideoDetailPage = ({ params: { id } }: ParamsProps) => {
    console.log(id);

    return <div>VideoDetailPage</div>;
};

export default VideoDetailPage;
