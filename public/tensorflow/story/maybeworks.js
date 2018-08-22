async function predictfuture(){

    ////////////////////////
    // create fake data
    ///////////////////////

    var xs = tf.tensor3d([
        [[1],[1],[0]],
        [[1],[1],[0]],
        [[1],[1],[0]],
        [[1],[1],[0]],
        [[1],[1],[0]],
        [[1],[1],[0]]
    ]);
    xs.print();

    var ys = tf.tensor3d([
        [[1],[1],[0]],
        [[1],[1],[0]],
        [[1],[1],[0]],
        [[1],[1],[0]],
        [[1],[1],[0]],
        [[1],[1],[0]]
    ]);
    ys.print();


    ////////////////////////
    // create model w/ layers api
    ///////////////////////

    console.log('Creating Model...');

    /*

    model design:

                    i(xs)   h       o(ys)
    batch_size  ->  *       *       * -> batch_size
    timesteps   ->  *       *       * -> timesteps
    input_dim   ->  *       *       * -> input_dim


    */

    const model = tf.sequential();

    //hidden layer
    const hidden = tf.layers.lstm({
        units: 3,
        activation: 'sigmoid',
        inputShape: [3 , 1],
		returnSequences:true
    });
    model.add(hidden);

    //output layer
    const output = tf.layers.lstm({
        units: 1,
        activation: 'sigmoid',
        //inputShape: [3], //optional
		returnSequences:true
    });
    model.add(output);

    //compile
    const sgdoptimizer = tf.train.sgd(3)
    model.compile({
        optimizer: sgdoptimizer,
        loss: tf.losses.meanSquaredError
    });

    ////////////////////////
    // train & predict
    ///////////////////////

    console.log('Training Model...');

    model.fit(xs, ys, { epochs: 100 }).then(() => {

        console.log('Training Complete!');
        console.log('Creating Prediction...');

        const inputs = tf.tensor3d( [1,1,0],[1,3,1] );
        let outputs = model.predict(inputs);
        outputs.print();

    });

}

predictfuture();